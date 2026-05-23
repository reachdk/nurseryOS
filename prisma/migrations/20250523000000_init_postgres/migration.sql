-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "PlantType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typicalReadyDays" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VyapaarProductMap" (
    "id" TEXT NOT NULL,
    "vyapaarItemName" TEXT NOT NULL,
    "plantTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VyapaarProductMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantingBatch" (
    "id" TEXT NOT NULL,
    "plantTypeId" TEXT NOT NULL,
    "plantedQuantity" INTEGER NOT NULL,
    "remainingQuantity" INTEGER NOT NULL,
    "plantedDate" TIMESTAMP(3) NOT NULL,
    "expectedReadyDate" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'growing',
    "wastage" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantingBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLot" (
    "id" TEXT NOT NULL,
    "plantTypeId" TEXT NOT NULL,
    "plantingBatchId" TEXT,
    "quantity" INTEGER NOT NULL,
    "remainingQuantity" INTEGER NOT NULL,
    "movedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "plantTypeId" TEXT NOT NULL,
    "partyName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "saleType" TEXT NOT NULL DEFAULT 'vyapaar_import',
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalRef" TEXT,
    "notes" TEXT,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantType_name_key" ON "PlantType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VyapaarProductMap_vyapaarItemName_key" ON "VyapaarProductMap"("vyapaarItemName");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_externalRef_key" ON "Sale"("externalRef");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- AddForeignKey
ALTER TABLE "VyapaarProductMap" ADD CONSTRAINT "VyapaarProductMap_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "PlantType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantingBatch" ADD CONSTRAINT "PlantingBatch_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "PlantType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLot" ADD CONSTRAINT "InventoryLot_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "PlantType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLot" ADD CONSTRAINT "InventoryLot_plantingBatchId_fkey" FOREIGN KEY ("plantingBatchId") REFERENCES "PlantingBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "PlantType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
