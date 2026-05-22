import { prisma } from "@/lib/prisma";
import { formatWeek } from "@/lib/dates";

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
  inNursery: number;
  inOffice: number;
  availableNow: number;
  batchRows: BatchLocationRow[];
  upcomingBatches: UpcomingBatch[];
};

export async function getPlantAvailability(
  plantTypeId: string
): Promise<PlantAvailability | null> {
  const plant = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
    include: {
      inventoryLots: true,
      plantingBatches: { orderBy: { expectedReadyDate: "asc" } },
    },
  });

  if (!plant) return null;

  const inOffice = plant.inventoryLots.reduce(
    (sum, lot) => sum + lot.remainingQuantity,
    0
  );

  const inNursery = plant.plantingBatches.reduce(
    (sum, batch) => sum + batch.remainingQuantity,
    0
  );

  const availableNow = inOffice;

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
    inNursery,
    inOffice,
    availableNow,
    batchRows,
    upcomingBatches,
  };
}

export async function getAllPlantAvailability(): Promise<PlantAvailability[]> {
  const plants = await prisma.plantType.findMany({ orderBy: { name: "asc" } });
  const results = await Promise.all(
    plants.map((p) => getPlantAvailability(p.id))
  );
  return results.filter((r): r is PlantAvailability => r !== null);
}
