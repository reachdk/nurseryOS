import { NextResponse } from "next/server";
import {
  fetchAllPlantAvailability,
  getAllPlantAvailability,
  INVENTORY_CACHE_VERSION,
  resolveDeployCacheKey,
} from "@/lib/availability";
import { requireUser } from "@/lib/auth";
import { calendarDayInNursery } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

/** Production-safe diagnostic (auth required). Compare DB vs cached vs fresh compute. */
export async function GET() {
  await requireUser();

  const brinjalPlant = await prisma.plantType.findFirst({
    where: { name: { contains: "rinjal", mode: "insensitive" } },
    include: {
      inventoryLots: true,
      plantingBatches: true,
    },
  });

  const [fresh, cached] = await Promise.all([
    fetchAllPlantAvailability(),
    getAllPlantAvailability(),
  ]);

  const freshBrinjal = fresh.find((p) => /brinjal/i.test(p.plantName));
  const cachedBrinjal = cached.find((p) => /brinjal/i.test(p.plantName));

  return NextResponse.json({
    now: new Date().toISOString(),
    indiaDay: calendarDayInNursery(new Date()),
    cacheVersion: INVENTORY_CACHE_VERSION,
    deployCacheKey: resolveDeployCacheKey(),
    vercelEnv: {
      VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID ?? null,
      VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      NODE_ENV: process.env.NODE_ENV ?? null,
    },
    db: brinjalPlant
      ? {
          plantId: brinjalPlant.id,
          inventoryLotCount: brinjalPlant.inventoryLots.length,
          inventoryLotRemaining: brinjalPlant.inventoryLots.reduce(
            (s, l) => s + l.remainingQuantity,
            0
          ),
          plantingBatchCount: brinjalPlant.plantingBatches.length,
          batches: brinjalPlant.plantingBatches.map((b) => ({
            remaining: b.remainingQuantity,
            expectedReadyDate: b.expectedReadyDate.toISOString(),
            readyDayIndia: calendarDayInNursery(b.expectedReadyDate),
            stage: b.stage,
          })),
        }
      : null,
    freshCompute: freshBrinjal
      ? {
          availableNow: freshBrinjal.availableNow,
          readyInNursery: freshBrinjal.readyInNursery,
          inOffice: freshBrinjal.inOffice,
          inNursery: freshBrinjal.inNursery,
        }
      : null,
    cachedHome: cachedBrinjal
      ? {
          availableNow: cachedBrinjal.availableNow,
          readyInNursery: cachedBrinjal.readyInNursery,
          inOffice: cachedBrinjal.inOffice,
          inNursery: cachedBrinjal.inNursery,
        }
      : null,
    note:
      "Empty inventory_lot is normal when stock is still in nursery; free to sell should include ready planting_batch.",
  });
}
