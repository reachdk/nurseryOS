import { prisma } from "@/lib/prisma";
import { isReadyForSale } from "@/lib/availability-core";
import { mergeSellableStock } from "@/lib/sellable-stock";

export async function getOfficeStockByPlant(): Promise<Map<string, number>> {
  const grouped = await prisma.inventoryLot.groupBy({
    by: ["plantTypeId"],
    where: { remainingQuantity: { gt: 0 } },
    _sum: { remainingQuantity: true },
  });
  return new Map(
    grouped.map((g) => [g.plantTypeId, g._sum.remainingQuantity ?? 0])
  );
}

/** Nursery batches with ready date today or earlier. */
export async function getReadyNurseryStockByPlant(
  asOf: Date = new Date()
): Promise<Map<string, number>> {
  const batches = await prisma.plantingBatch.findMany({
    where: { remainingQuantity: { gt: 0 } },
    select: {
      plantTypeId: true,
      remainingQuantity: true,
      expectedReadyDate: true,
    },
  });

  const map = new Map<string, number>();
  for (const b of batches) {
    if (!isReadyForSale(b.expectedReadyDate, asOf)) continue;
    map.set(b.plantTypeId, (map.get(b.plantTypeId) ?? 0) + b.remainingQuantity);
  }
  return map;
}

/** Office + ready nursery (same rule as Free to sell). */
export async function getSellableStockByPlant(
  asOf: Date = new Date()
): Promise<Map<string, number>> {
  const [office, readyNursery] = await Promise.all([
    getOfficeStockByPlant(),
    getReadyNurseryStockByPlant(asOf),
  ]);
  return mergeSellableStock(office, readyNursery);
}

export async function getOfficeStock(plantTypeId: string): Promise<number> {
  const lots = await prisma.inventoryLot.findMany({
    where: { plantTypeId },
  });
  return lots.reduce((sum, lot) => sum + lot.remainingQuantity, 0);
}

/** Deduct office lots first, then ready nursery batches. */
export async function deductSellableStock(
  plantTypeId: string,
  quantity: number,
  asOf: Date = new Date()
): Promise<{ deducted: number; shortfall: number }> {
  const lots = await prisma.inventoryLot.findMany({
    where: { plantTypeId, remainingQuantity: { gt: 0 } },
    orderBy: { movedDate: "asc" },
  });

  let remaining = quantity;

  for (const lot of lots) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, lot.remainingQuantity);
    await prisma.inventoryLot.update({
      where: { id: lot.id },
      data: { remainingQuantity: lot.remainingQuantity - take },
    });
    remaining -= take;
  }

  if (remaining <= 0) {
    return { deducted: quantity, shortfall: 0 };
  }

  const nurseryCandidates = await prisma.plantingBatch.findMany({
    where: { plantTypeId, remainingQuantity: { gt: 0 } },
    orderBy: [{ expectedReadyDate: "asc" }, { createdAt: "asc" }],
  });
  const readyBatches = nurseryCandidates.filter((b) =>
    isReadyForSale(b.expectedReadyDate, asOf)
  );

  for (const batch of readyBatches) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, batch.remainingQuantity);
    await prisma.plantingBatch.update({
      where: { id: batch.id },
      data: {
        remainingQuantity: batch.remainingQuantity - take,
        stage:
          batch.remainingQuantity - take <= 0 ? "moved" : batch.stage,
      },
    });
    remaining -= take;
  }

  return {
    deducted: quantity - remaining,
    shortfall: remaining,
  };
}

/** @deprecated Use deductSellableStock */
export async function deductOfficeStock(
  plantTypeId: string,
  quantity: number
): Promise<{ deducted: number; shortfall: number }> {
  return deductSellableStock(plantTypeId, quantity);
}
