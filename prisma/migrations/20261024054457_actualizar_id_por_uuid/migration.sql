/*
  Warnings:

  - The `rubroId` column on the `Emprendimiento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Estado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Rubro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Estado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nroTramite` on the `Inscripcion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estadoId` on the `Inscripcion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Rubro` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Emprendimiento" DROP CONSTRAINT "Emprendimiento_rubroId_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_estadoId_fkey";

-- AlterTable
ALTER TABLE "Emprendimiento" DROP COLUMN "rubroId",
ADD COLUMN     "rubroId" UUID;

-- AlterTable
ALTER TABLE "Estado" DROP CONSTRAINT "Estado_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Estado_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Inscripcion" DROP COLUMN "nroTramite",
ADD COLUMN     "nroTramite" UUID NOT NULL,
DROP COLUMN "estadoId",
ADD COLUMN     "estadoId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Rubro" DROP CONSTRAINT "Rubro_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_nroTramite_key" ON "Inscripcion"("nroTramite");

-- AddForeignKey
ALTER TABLE "Emprendimiento" ADD CONSTRAINT "Emprendimiento_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
