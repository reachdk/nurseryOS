import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatWeek } from "@/lib/dates";

export const INVENTORY_CACHE_TAG = "inventory";

const plantInclude = {
  inventoryLots: true,
  plantingBatches: { orderBy: { expectedReadyDate: "asc" as const } },
};

type PlantWithStock = {
  id: string;
  name: string;
  typicalReadyDays: number;
  inventoryLots: { plantingBatchId: string | null; remainingQuantity: number }[];
  plantingBatches: {
    id: string;
    expectedReadyDate: Date;
    remainingQuantity: number;
  }[];
};

export type UpcomingBatch = {
  batchId: string;
  readyDate: Date;
  readyLabel: string;
  inNursery: number;
};

export type BatchLocationRow = {
  batchId: string;
  readyDate: Date;
  readyLabel: string;
  inNursery: number;
  inOffice: number;
};

export type PlantAvailability = {
  plantTypeId: string;
  plantName: string;
  typicalReadyDays: number;
  inNursery: number;
  inOffice: number;
  availableNow: number;
  batchRows: BatchLocationRow[];
  upcomingBatches: UpcomingBatch[];
};

export type PlantDetail = PlantAvailability & {
  nurseryBatches: {
    id: string;
    expectedReadyDate: Date;
    remainingQuantity: number;
  }[];
};

function computeAvailability(plant: PlantWithStock): PlantAvailability {
  const inOffice = plant.inventoryLots.reduce(
    (sum, lot) => sum + lot.remainingQuantity,
    0
  );

  const inNursery = plant.plantingBatches.reduce(
    (sum, batch) => sum + batch.remainingQuantity,
    0
  );

  const batchRows: BatchLocationRow[] = plant.plantingBatches
    .map((batch) => {
      const inOfficeQty = plant.inventoryLots
        .filter((lot) => lot.plantingBatchId === batch.id)
        .reduce((sum, lot) => sum + lot.remainingQuantity, 0);

      return {
        batchId: batch.id,
        readyDate: batch.expectedReadyDate,
        readyLabel: formatWeek(batch.expectedReadyDate),
        inNursery: batch.remainingQuantity,
        inOffice: inOfficeQty,
      };
    })
    .filter((row) => row.inNursery > 0 || row.inOffice > 0);

  const upcomingBatches: UpcomingBatch[] = plant.plantingBatches
    .filter((batch) => batch.remainingQuantity > 0)
    .map((batch) => ({
      batchId: batch.id,
      readyDate: batch.expectedReadyDate,
      readyLabel: formatWeek(batch.expectedReadyDate),
      inNursery: batch.remainingQuantity,
    }));

  return {
    plantTypeId: plant.id,
    plantName: plant.name,
    typicalReadyDays: plant.typicalReadyDays,
    inNursery,
    inOffice,
    availableNow: inOffice,
    batchRows,
    upcomingBatches,
  };
}

async function fetchAllPlantAvailability(): Promise<PlantAvailability[]> {
  const plants = await prisma.plantType.findMany({
    orderBy: { name: "asc" },
    include: plantInclude,
  });
  return plants.map(computeAvailability);
}

export const getAllPlantAvailability = unstable_cache(
  fetchAllPlantAvailability,
  ["all-plant-availability"],
  { revalidate: 60, tags: [INVENTORY_CACHE_TAG] }
);

export async function getPlantAvailability(
  plantTypeId: string
): Promise<PlantAvailability | null> {
  const plant = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
    include: plantInclude,
  });

  if (!plant) return null;
  return computeAvailability(plant);
}

export async function getPlantDetail(
  plantTypeId: string
): Promise<PlantDetail | null> {
  const plant = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
    include: plantInclude,
  });

  if (!plant) return null;

  const avail = computeAvailability(plant);
  const nurseryBatches = plant.plantingBatches
    .filter((b) => b.remainingQuantity > 0)
    .map((b) => ({
      id: b.id,
      expectedReadyDate: b.expectedReadyDate,
      remainingQuantity: b.remainingQuantity,
    }));

  return { ...avail, nurseryBatches };
}
