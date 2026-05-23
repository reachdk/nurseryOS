import { unstable_cache, unstable_expireTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { debugLog } from "@/lib/debug-log";
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
export const INVENTORY_CACHE_VERSION = "v4-sellable-nursery";

/** Unique per Vercel deploy; avoids cache key stuck on "production". */
export function resolveDeployCacheKey(): string {
  return (
    process.env.VERCEL_DEPLOYMENT_ID ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.NODE_ENV ??
    "local"
  );
}

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

export async function fetchAllPlantAvailability(): Promise<PlantAvailability[]> {
  const plants = await prisma.plantType.findMany({
    orderBy: { name: "asc" },
    include: plantInclude,
  });

  const brinjal = plants.find((p) => /brinjal/i.test(p.name));
  if (brinjal) {
    // #region agent log
    debugLog({
      location: "availability.ts:fetch-raw",
      message: "Prisma raw Brinjal before compute",
      hypothesisId: "H2",
      data: {
        plantId: brinjal.id,
        lotCount: brinjal.inventoryLots.length,
        batchCount: brinjal.plantingBatches.length,
        batches: brinjal.plantingBatches.map((b) => ({
          remaining: b.remainingQuantity,
          ready: b.expectedReadyDate.toISOString(),
        })),
      },
    });
    // #endregion
  }

  const result = plants.map((p) => computeAvailability(p as PlantWithStock));
  const brinjalAvail = result.find((p) => /brinjal/i.test(p.plantName));
  if (brinjalAvail) {
    if (process.env.VERCEL) {
      console.info(
        "[inventory] brinjal fresh",
        JSON.stringify({
          availableNow: brinjalAvail.availableNow,
          readyInNursery: brinjalAvail.readyInNursery,
          inNursery: brinjalAvail.inNursery,
          deployCacheKey,
        })
      );
    }
    // #region agent log
    debugLog({
      location: "availability.ts:fetch-computed",
      message: "Fresh fetch Brinjal totals (uncached)",
      hypothesisId: "H5",
      data: {
        availableNow: brinjalAvail.availableNow,
        readyInNursery: brinjalAvail.readyInNursery,
        inOffice: brinjalAvail.inOffice,
        inNursery: brinjalAvail.inNursery,
      },
    });
    // #endregion
  }
  return result;
}

const deployCacheKey = resolveDeployCacheKey();

let expiredInventoryTagForDeploy: string | null = null;

function ensureInventoryCacheForDeploy(): void {
  if (!process.env.VERCEL) return;
  if (expiredInventoryTagForDeploy === deployCacheKey) return;
  unstable_expireTag(INVENTORY_CACHE_TAG);
  expiredInventoryTagForDeploy = deployCacheKey;
  // #region agent log
  debugLog({
    location: "availability.ts:expire-on-deploy",
    message: "Expired inventory tag for deployment",
    hypothesisId: "H3",
    data: { deployCacheKey },
  });
  // #endregion
}

const getCachedAllPlantAvailability = unstable_cache(
  fetchAllPlantAvailability,
  [INVENTORY_CACHE_VERSION, "all-plants", deployCacheKey],
  { revalidate: 60, tags: [INVENTORY_CACHE_TAG] }
);

/** Old cache entries lacked readyInNursery but had nursery stock (office-only era). */
function looksLikeStaleSellableCache(plant: PlantAvailability): boolean {
  return (
    plant.inNursery > 0 &&
    plant.availableNow === 0 &&
    (plant.readyInNursery ?? 0) === 0
  );
}

function sellableMismatch(
  cached: PlantAvailability[],
  fresh: PlantAvailability[]
): boolean {
  return fresh.some((f) => {
    const c = cached.find((x) => x.plantTypeId === f.plantTypeId);
    if (!c) return true;
    return (
      looksLikeStaleSellableCache(c) ||
      c.availableNow !== f.availableNow ||
      c.readyInNursery !== f.readyInNursery
    );
  });
}

export async function getAllPlantAvailability(): Promise<PlantAvailability[]> {
  ensureInventoryCacheForDeploy();

  let result = await getCachedAllPlantAvailability();

  if (result.some(looksLikeStaleSellableCache)) {
    const fresh = await fetchAllPlantAvailability();
    if (sellableMismatch(result, fresh)) {
      unstable_expireTag(INVENTORY_CACHE_TAG);
      result = fresh;
      // #region agent log
      debugLog({
        location: "availability.ts:cache-mismatch",
        message: "Cached sellable totals differ from fresh; using fresh",
        hypothesisId: "H3",
        data: {
          brinjalCached: result.find((p) => /brinjal/i.test(p.plantName)),
          brinjalFresh: fresh.find((p) => /brinjal/i.test(p.plantName)),
        },
      });
      // #endregion
    }
  }

  const brinjal = result.find((p) => /brinjal/i.test(p.plantName));
  if (brinjal) {
    // #region agent log
    debugLog({
      location: "availability.ts:getAll-cached",
      message: "getAllPlantAvailability Brinjal (final)",
      hypothesisId: "H3",
      data: {
        availableNow: brinjal.availableNow,
        readyInNursery: brinjal.readyInNursery,
        inOffice: brinjal.inOffice,
        deployCacheKey,
        cacheVersion: INVENTORY_CACHE_VERSION,
      },
    });
    // #endregion
  }
  return result;
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
