import { calendarDayInNursery, formatWeek } from "@/lib/dates";
import { debugLog } from "@/lib/debug-log";

export type PlantWithStock = {
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

export type NurseryBatchSummary = {
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
  readyInNursery: number;
  availableNow: number;
  batchRows: BatchLocationRow[];
  readyNowBatches: NurseryBatchSummary[];
  upcomingBatches: NurseryBatchSummary[];
};

/** Ready date is today or earlier (India calendar day). */
export function isReadyForSale(
  expectedReadyDate: Date,
  asOf: Date = new Date()
): boolean {
  return (
    calendarDayInNursery(expectedReadyDate) <= calendarDayInNursery(asOf)
  );
}

export function computeAvailability(
  plant: PlantWithStock,
  asOf: Date = new Date()
): PlantAvailability {
  const inOffice = plant.inventoryLots.reduce(
    (sum, lot) => sum + lot.remainingQuantity,
    0
  );

  const inNursery = plant.plantingBatches.reduce(
    (sum, batch) => sum + batch.remainingQuantity,
    0
  );

  let readyInNursery = 0;
  const readyNowBatches: NurseryBatchSummary[] = [];
  const upcomingBatches: NurseryBatchSummary[] = [];

  for (const batch of plant.plantingBatches) {
    if (batch.remainingQuantity <= 0) continue;

    if (/brinjal/i.test(plant.name)) {
      const ready = isReadyForSale(batch.expectedReadyDate, asOf);
      // #region agent log
      debugLog({
        location: "availability-core.ts:batch-loop",
        message: "Brinjal batch ready check",
        hypothesisId: "H1",
        data: {
          batchId: batch.id.slice(0, 8),
          remaining: batch.remainingQuantity,
          readyIso: batch.expectedReadyDate.toISOString(),
          readyDayIndia: calendarDayInNursery(batch.expectedReadyDate),
          asOfDayIndia: calendarDayInNursery(asOf),
          isReadyForSale: ready,
        },
      });
      // #endregion
    }

    const summary: NurseryBatchSummary = {
      batchId: batch.id,
      readyDate: batch.expectedReadyDate,
      readyLabel: formatWeek(batch.expectedReadyDate),
      inNursery: batch.remainingQuantity,
    };

    if (isReadyForSale(batch.expectedReadyDate, asOf)) {
      readyInNursery += batch.remainingQuantity;
      readyNowBatches.push(summary);
    } else {
      upcomingBatches.push(summary);
    }
  }

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

  const result = {
    plantTypeId: plant.id,
    plantName: plant.name,
    typicalReadyDays: plant.typicalReadyDays,
    inNursery,
    inOffice,
    readyInNursery,
    availableNow: inOffice + readyInNursery,
    batchRows,
    readyNowBatches,
    upcomingBatches,
  };

  if (/brinjal/i.test(plant.name)) {
    // #region agent log
    debugLog({
      location: "availability-core.ts:compute-result",
      message: "Brinjal computeAvailability result",
      hypothesisId: "H4",
      data: {
        inOffice,
        readyInNursery,
        availableNow: result.availableNow,
        batchCount: plant.plantingBatches.length,
        lotCount: plant.inventoryLots.length,
      },
    });
    // #endregion
  }

  return result;
}
