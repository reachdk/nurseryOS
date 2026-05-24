"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { INVENTORY_CACHE_TAG } from "@/lib/availability";

/** Purge inventory cache after stock mutations (Server Action context only). */
function revalidateInventory() {
  revalidateTag(INVENTORY_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/plants", "layout");
}
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { deductSellableStock, getSellableStockByPlant } from "@/lib/inventory";
import {
  parseCsvText,
  parseSheetRows,
  type PreviewImportRow,
} from "@/lib/vyapaar-import";

export async function createPlantType(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const typicalReadyDays = Number(formData.get("typicalReadyDays"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) {
    redirect("/plants/new?error=" + encodeURIComponent("Name is required."));
  }

  if (!Number.isFinite(typicalReadyDays) || typicalReadyDays < 1) {
    redirect(
      "/plants/new?error=" +
        encodeURIComponent("Typical days to ready must be at least 1.")
    );
  }

  try {
    const plant = await prisma.plantType.create({
      data: { name, typicalReadyDays, notes },
    });
    await logAudit(user, {
      action: "plant.create",
      entityType: "PlantType",
      entityId: plant.id,
      metadata: { name },
    });
  } catch {
    redirect(
      `/plants/new?error=${encodeURIComponent(
        `"${name}" already exists. Use a distinct name for variants (e.g. ${name} F1).`
      )}&name=${encodeURIComponent(name)}`
    );
  }

  revalidateInventory();
  revalidatePath("/plants");
  redirect("/plants");
}

export async function createPlantingBatch(formData: FormData) {
  const user = await requireUser();
  const plantTypeId = String(formData.get("plantTypeId"));
  const plantedQuantity = Number(formData.get("plantedQuantity"));
  const plantedDateStr = String(formData.get("plantedDate") ?? "");
  const expectedReadyDateStr = String(formData.get("expectedReadyDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!plantedDateStr || !expectedReadyDateStr) {
    redirect(
      `/batches/new?plant=${plantTypeId}&error=${encodeURIComponent(
        "Planted date and expected ready date are required."
      )}`
    );
  }

  const { parseDateOnly } = await import("@/lib/dates");
  const plantedDate = parseDateOnly(plantedDateStr);
  const expectedReadyDate = parseDateOnly(expectedReadyDateStr);

  if (expectedReadyDate < plantedDate) {
    redirect(
      `/batches/new?plant=${plantTypeId}&error=${encodeURIComponent(
        "Expected ready date must be on or after the planted date."
      )}`
    );
  }

  const batch = await prisma.plantingBatch.create({
    data: {
      plantTypeId,
      plantedQuantity,
      remainingQuantity: plantedQuantity,
      plantedDate,
      expectedReadyDate,
      stage: "growing",
      notes,
    },
  });

  await logAudit(user, {
    action: "batch.create",
    entityType: "PlantingBatch",
    entityId: batch.id,
    metadata: { plantTypeId, plantedQuantity },
  });

  revalidateInventory();
  revalidatePath("/");
  revalidatePath(`/plants/${plantTypeId}`);
  redirect(`/plants/${plantTypeId}`);
}

export async function moveBatchToStock(batchId: string, formData: FormData) {
  const user = await requireUser();
  const moveQuantity = Number(formData.get("moveQuantity"));

  const batch = await prisma.plantingBatch.findUniqueOrThrow({
    where: { id: batchId },
  });

  if (!Number.isFinite(moveQuantity) || moveQuantity < 1) {
    redirect(
      `/plants/${batch.plantTypeId}?moveError=${encodeURIComponent(
        "Enter a valid quantity to move."
      )}`
    );
  }

  if (moveQuantity > batch.remainingQuantity) {
    redirect(
      `/plants/${batch.plantTypeId}?moveError=${encodeURIComponent(
        `Cannot move more than ${batch.remainingQuantity.toLocaleString()} in nursery.`
      )}`
    );
  }

  await prisma.$transaction([
    prisma.inventoryLot.create({
      data: {
        plantTypeId: batch.plantTypeId,
        plantingBatchId: batchId,
        quantity: moveQuantity,
        remainingQuantity: moveQuantity,
        movedDate: new Date(),
      },
    }),
    prisma.plantingBatch.update({
      where: { id: batchId },
      data: {
        remainingQuantity: batch.remainingQuantity - moveQuantity,
        stage:
          batch.remainingQuantity - moveQuantity <= 0 ? "moved" : batch.stage,
      },
    }),
  ]);

  await logAudit(user, {
    action: "stock.move_to_office",
    entityType: "PlantingBatch",
    entityId: batchId,
    metadata: { moveQuantity, plantTypeId: batch.plantTypeId },
  });

  revalidateInventory();
  revalidatePath(`/plants/${batch.plantTypeId}`);
  revalidatePath("/");
  redirect(`/plants/${batch.plantTypeId}`);
}

export async function recordBatchLoss(formData: FormData) {
  const user = await requireUser();
  const plantTypeId = String(formData.get("plantTypeId"));
  const batchId = String(formData.get("batchId"));
  const quantity = Number(formData.get("quantity"));
  const reason = String(formData.get("reason") ?? "other");
  const notes = String(formData.get("notes") ?? "").trim();

  const batch = await prisma.plantingBatch.findUniqueOrThrow({
    where: { id: batchId },
  });

  if (quantity <= 0 || quantity > batch.remainingQuantity) {
    redirect(
      `/plants/${plantTypeId}?lossError=${encodeURIComponent(
        `Invalid quantity. Max ${batch.remainingQuantity.toLocaleString()} in nursery.`
      )}`
    );
  }

  const lossLine = `${reason}: ${quantity.toLocaleString()} lost${notes ? ` — ${notes}` : ""}`;
  const updatedNotes = batch.notes ? `${batch.notes}\n${lossLine}` : lossLine;

  await prisma.plantingBatch.update({
    where: { id: batchId },
    data: {
      remainingQuantity: batch.remainingQuantity - quantity,
      wastage: batch.wastage + quantity,
      notes: updatedNotes,
    },
  });

  await logAudit(user, {
    action: "batch.loss",
    entityType: "PlantingBatch",
    entityId: batchId,
    metadata: { quantity, reason, plantTypeId },
  });

  revalidateInventory();
  revalidatePath(`/plants/${plantTypeId}`);
  revalidatePath("/");
  redirect(`/plants/${plantTypeId}`);
}

export async function createVyapaarMapping(formData: FormData) {
  const user = await requireUser();
  const vyapaarItemName = String(formData.get("vyapaarItemName") ?? "").trim();
  const plantTypeId = String(formData.get("plantTypeId"));

  if (!vyapaarItemName || !plantTypeId) {
    redirect(
      "/settings/vyapaar?error=" + encodeURIComponent("Item name and plant are required.")
    );
  }

  try {
    const mapping = await prisma.vyapaarProductMap.create({
      data: { vyapaarItemName, plantTypeId },
    });
    await logAudit(user, {
      action: "vyapaar.map.create",
      entityType: "VyapaarProductMap",
      entityId: mapping.id,
      metadata: { vyapaarItemName, plantTypeId },
    });
  } catch {
    redirect(
      "/settings/vyapaar?error=" +
        encodeURIComponent("Mapping already exists for this Vyapaar item name.")
    );
  }

  revalidatePath("/settings/vyapaar");
  revalidatePath("/sync");
  redirect("/settings/vyapaar");
}

export async function deleteVyapaarMapping(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await prisma.vyapaarProductMap.delete({ where: { id } });
  await logAudit(user, {
    action: "vyapaar.map.delete",
    entityType: "VyapaarProductMap",
    entityId: id,
  });
  revalidatePath("/settings/vyapaar");
  revalidatePath("/sync");
  redirect("/settings/vyapaar");
}

export async function previewVyapaarImport(formData: FormData): Promise<{
  rows: PreviewImportRow[];
  error?: string;
}> {
  await requireUser();

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { rows: [], error: "Please choose a file." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  let parsed;

  try {
    if (name.endsWith(".csv") || name.endsWith(".txt")) {
      parsed = parseCsvText(buffer.toString("utf-8"));
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const readXlsxFile = (await import("read-excel-file/node")).default;
      const rows = await readXlsxFile(buffer);
      const normalized = rows.map((row) =>
        row.map((cell) => (cell == null ? "" : cell))
      ) as unknown[][];
      parsed = parseSheetRows(normalized);
    } else {
      return { rows: [], error: "Use CSV or Excel (.xlsx) from Vyapaar." };
    }
  } catch {
    return { rows: [], error: "Could not read file. Try exporting again from Vyapaar." };
  }

  if (parsed.length === 0) {
    return {
      rows: [],
      error:
        "No sale lines found. Check columns include item/product and quantity.",
    };
  }

  const [maps, existingRefs] = await Promise.all([
    prisma.vyapaarProductMap.findMany({ include: { plantType: true } }),
    prisma.sale.findMany({
      where: { externalRef: { in: parsed.map((r) => r.externalRef) } },
      select: { externalRef: true },
    }),
  ]);

  const mapByItem = new Map(
    maps.map((m) => [m.vyapaarItemName.toLowerCase(), m])
  );
  const refSet = new Set(existingRefs.map((r) => r.externalRef));

  const sellableByPlant = await getSellableStockByPlant();

  const preview: PreviewImportRow[] = [];

  for (const row of parsed) {
    const map = mapByItem.get(row.itemName.toLowerCase());
    if (refSet.has(row.externalRef)) {
      preview.push({
        ...row,
        status: "duplicate",
        message: "Already imported",
      });
      continue;
    }
    if (!map) {
      preview.push({
        ...row,
        status: "unmapped",
        message: "Map this item in Vyapaar mappings",
      });
      continue;
    }

    const sellable = sellableByPlant.get(map.plantTypeId) ?? 0;
    if (row.quantity > sellable) {
      preview.push({
        ...row,
        status: "insufficient",
        plantTypeId: map.plantTypeId,
        plantName: map.plantType.name,
        message: `Only ${sellable.toLocaleString()} free to sell`,
      });
      continue;
    }

    preview.push({
      ...row,
      status: "ok",
      plantTypeId: map.plantTypeId,
      plantName: map.plantType.name,
    });
  }

  return { rows: preview };
}

export async function confirmVyapaarImport(formData: FormData) {
  const user = await requireUser();
  const payload = String(formData.get("payload") ?? "");
  let rows: PreviewImportRow[];
  try {
    rows = JSON.parse(payload) as PreviewImportRow[];
  } catch {
    redirect("/sync?error=" + encodeURIComponent("Invalid import data."));
  }

  const okRows = rows.filter((r) => r.status === "ok" && r.plantTypeId);
  let imported = 0;
  let skipped = 0;

  for (const row of okRows) {
    const existing = await prisma.sale.findUnique({
      where: { externalRef: row.externalRef },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const { shortfall } = await deductSellableStock(row.plantTypeId!, row.quantity);
    if (shortfall > 0) {
      skipped++;
      continue;
    }

    await prisma.sale.create({
      data: {
        plantTypeId: row.plantTypeId!,
        partyName: row.partyName,
        quantity: row.quantity,
        saleType: "vyapaar_import",
        soldAt: new Date(row.soldAt),
        externalRef: row.externalRef,
      },
    });
    imported++;
  }

  await logAudit(user, {
    action: "vyapaar.import",
    metadata: { imported, skipped, total: okRows.length },
  });

  revalidateInventory();
  revalidatePath("/");
  revalidatePath("/sync");
  revalidatePath("/plants");
  redirect(
    `/sync?success=${encodeURIComponent(`Imported ${imported} sale line(s). Office stock updated.`)}`
  );
}
