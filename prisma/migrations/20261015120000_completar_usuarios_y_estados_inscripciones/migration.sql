-- DropForeignKey
ALTER TABLE "Estado" DROP CONSTRAINT "Estado_inscripcionId_fkey";

-- DropIndex
DROP INDEX "Estado_inscripcionId_key";

-- AlterTable
ALTER TABLE "Estado" DROP COLUMN "inscripcionId";

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "estadoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "cuil" TEXT NOT NULL,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sexo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cuil_key" ON "Usuario"("cuil");

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
