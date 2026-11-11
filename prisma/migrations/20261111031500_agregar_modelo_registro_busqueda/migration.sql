-- CreateTable
CREATE TABLE "RegistroBusqueda" (
    "id" UUID NOT NULL,
    "termino" VARCHAR(100) NOT NULL,
    "entidad" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroBusqueda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroBusqueda_termino_idx" ON "RegistroBusqueda"("termino");

-- CreateIndex
CREATE INDEX "RegistroBusqueda_createdAt_idx" ON "RegistroBusqueda"("createdAt");

