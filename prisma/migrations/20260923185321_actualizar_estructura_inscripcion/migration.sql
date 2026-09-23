/*
  Warnings:

  - Added the required column `trayectoria` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "trayectoria" TEXT NOT NULL;
