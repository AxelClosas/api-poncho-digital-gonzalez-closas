/*
  Warnings:

  - The `estado` column on the `Stand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Emprendimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoStand" AS ENUM ('DISPONIBLE', 'OCUPADO');

-- AlterTable
ALTER TABLE "Emprendimiento" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoStand" NOT NULL DEFAULT 'DISPONIBLE';
