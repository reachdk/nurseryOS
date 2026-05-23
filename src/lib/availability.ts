import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  computeAvailability,
  type PlantAvailability,
  type PlantWithStock,
} from "@/lib/availability-core";

export const INVENTORY_CACHE_TAG = "inventory";

/**
 * Bump when availability rules change so old Data Cache entries are not reused.
 * Also paired with VERCEL_GIT_COMMIT_SHA in the cache key (fresh cache each deploy).
 */
export const INVENTORY_CACHE_VERSION = "v3-sellable-nursery";

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

/** Deploy id in key avoids serving pre-deploy cached totals after a release. */
const deployId =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NODE_ENV ?? "local";

const getCachedAllPlantAvailability = unstable_cache(
  fetchAllPlantAvailability,
  [INVENTORY_CACHE_VERSION, "all-plants", deployId],
  { revalidate: 60, tags: [INVENTORY_CACHE_TAG] }
);

export async function getAllPlantAvailability(): Promise<PlantAvailability[]> {
  return getCachedAllPlantAvailability();
}

/** Same cached totals as Home — avoids Home vs detail mismatch. */
export async function getPlantAvailability(
  plantTypeId: string
): Promise<PlantAvailability | null> {
  const all = await getAllPlantAvailability();
  return all.find((p) => p.plantTypeId === plantTypeId) ?? null;
}

export async function getPlantDetail(
  plantTypeId: string
): Promise<PlantDetail | null> {
  const avail = await getPlantAvailability(plantTypeId);
  if (!avail) return null;

  const nurseryBatches = await prisma.plantingBatch.findMany({
    where: { plantTypeId, remainingQuantity: { gt: 0 } },
    select: {
      id: true,
      expectedReadyDate: true,
      remainingQuantity: true,
    },
    orderBy: { expectedReadyDate: "asc" },
  });

  return { ...avail, nurseryBatches };
}
