/*
  Warnings:

  - The primary key for the `Emprendimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `standId` column on the `Emprendimiento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Pabellon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Producto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Stand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Emprendimiento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Pabellon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Producto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `emprendimientoId` on the `Producto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Sector` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pabellonId` on the `Sector` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Stand` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sectorId` on the `Stand` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Emprendimiento" DROP CONSTRAINT "Emprendimiento_standId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_emprendimientoId_fkey";

-- DropForeignKey
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_pabellonId_fkey";

-- DropForeignKey
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_sectorId_fkey";

-- AlterTable
ALTER TABLE "Emprendimiento" DROP CONSTRAINT "Emprendimiento_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "standId",
ADD COLUMN     "standId" UUID,
ADD CONSTRAINT "Emprendimiento_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pabellon" DROP CONSTRAINT "Pabellon_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "emprendimientoId",
ADD COLUMN     "emprendimientoId" UUID NOT NULL,
ADD CONSTRAINT "Producto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "pabellonId",
ADD COLUMN     "pabellonId" UUID NOT NULL,
ADD CONSTRAINT "Sector_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "sectorId",
ADD COLUMN     "sectorId" UUID NOT NULL,
ADD CONSTRAINT "Stand_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Emprendimiento_standId_key" ON "Emprendimiento"("standId");

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprendimiento" ADD CONSTRAINT "Emprendimiento_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_emprendimientoId_fkey" FOREIGN KEY ("emprendimientoId") REFERENCES "Emprendimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
