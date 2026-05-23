import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  computeAvailability,
  type PlantAvailability,
  type PlantWithStock,
} from "@/lib/availability-core";

export const INVENTORY_CACHE_TAG = "inventory";

export type {
  PlantAvailability,
  BatchLocationRow,
  NurseryBatchSummary,
  PlantWithStock,
} from "@/lib/availability-core";

/** @deprecated Use NurseryBatchSummary */
export type UpcomingBatch = import("@/lib/availability-core").NurseryBatchSummary;

const plantInclude = {
  inventoryLots: true,
  plantingBatches: { orderBy: { expectedReadyDate: "asc" as const } },
};

export type PlantDetail = PlantAvailability & {
  nurseryBatches: {
    id: string;
    expectedReadyDate: Date;
    remainingQuantity: number;
  }[];
};

async function fetchAllPlantAvailability(): Promise<PlantAvailability[]> {
  const plants = await prisma.plantType.findMany({
    orderBy: { name: "asc" },
    include: plantInclude,
  });
  return plants.map((p) => computeAvailability(p as PlantWithStock));
}

export const getAllPlantAvailability = unstable_cache(
  fetchAllPlantAvailability,
  ["all-plant-availability", "v2-sellable-nursery"],
  { revalidate: 30, tags: [INVENTORY_CACHE_TAG] }
);

export async function getPlantAvailability(
  plantTypeId: string
): Promise<PlantAvailability | null> {
  const plant = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
    include: plantInclude,
  });

  if (!plant) return null;
  return computeAvailability(plant as PlantWithStock);
}

export async function getPlantDetail(
  plantTypeId: string
): Promise<PlantDetail | null> {
  const plant = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
    include: plantInclude,
  });

  if (!plant) return null;

  const avail = computeAvailability(plant as PlantWithStock);
  const nurseryBatches = plant.plantingBatches
    .filter((b) => b.remainingQuantity > 0)
    .map((b) => ({
      id: b.id,
      expectedReadyDate: b.expectedReadyDate,
      remainingQuantity: b.remainingQuantity,
    }));

  return { ...avail, nurseryBatches };
}
