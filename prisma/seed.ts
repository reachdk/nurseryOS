import { PrismaClient } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const cabbage = await prisma.plantType.upsert({
    where: { name: "Cabbage" },
    update: { typicalReadyDays: 30 },
    create: {
      name: "Cabbage",
      typicalReadyDays: 30,
      notes: "Fast crop",
    },
  });

  const tomato = await prisma.plantType.upsert({
    where: { name: "Tomato" },
    update: { typicalReadyDays: 38 },
    create: {
      name: "Tomato",
      typicalReadyDays: 38,
    },
  });

  await prisma.vyapaarProductMap.upsert({
    where: { vyapaarItemName: "Cabbage" },
    update: { plantTypeId: cabbage.id },
    create: { vyapaarItemName: "Cabbage", plantTypeId: cabbage.id },
  });

  const batch1 = await prisma.plantingBatch.create({
    data: {
      plantTypeId: cabbage.id,
      plantedQuantity: 30000,
      remainingQuantity: 30000,
      plantedDate: subDays(new Date(), 20),
      expectedReadyDate: addDays(new Date(), 7),
      stage: "growing",
    },
  });

  await prisma.plantingBatch.create({
    data: {
      plantTypeId: cabbage.id,
      plantedQuantity: 50000,
      remainingQuantity: 50000,
      plantedDate: subDays(new Date(), 10),
      expectedReadyDate: addDays(new Date(), 14),
      stage: "growing",
    },
  });

  await prisma.inventoryLot.create({
    data: {
      plantTypeId: cabbage.id,
      quantity: 12000,
      remainingQuantity: 12000,
      movedDate: subDays(new Date(), 2),
    },
  });

  console.log("Seed complete:", { cabbage: cabbage.name, batch1: batch1.id });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
