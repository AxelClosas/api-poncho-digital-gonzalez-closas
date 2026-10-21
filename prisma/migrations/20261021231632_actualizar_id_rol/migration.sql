/*
  Warnings:

  - The primary key for the `Rol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsuarioRol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Rol` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rolId` on the `UsuarioRol` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_rolId_fkey";

-- AlterTable
ALTER TABLE "Rol" DROP CONSTRAINT "Rol_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Rol_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_pkey",
DROP COLUMN "rolId",
ADD COLUMN     "rolId" UUID NOT NULL,
ADD CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuarioId", "rolId");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
