/*
  Warnings:

  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "disabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Product" ADD COLUMN "updatedBy" TEXT;

UPDATE "Product" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
UPDATE "Product" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL;