/*
  Warnings:

  - The primary key for the `Localidad` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_localidadId_fkey";

-- AlterTable
ALTER TABLE "Localidad" DROP CONSTRAINT "Localidad_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "localidadId" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
