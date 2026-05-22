import { prisma } from "@/lib/prisma";

export async function deductOfficeStock(
  plantTypeId: string,
  quantity: number
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

  return {
    deducted: quantity - remaining,
    shortfall: remaining,
  };
}

export async function getOfficeStock(plantTypeId: string): Promise<number> {
  const lots = await prisma.inventoryLot.findMany({
    where: { plantTypeId },
  });
  return lots.reduce((sum, lot) => sum + lot.remainingQuantity, 0);
}
