import { z } from "zod";

export const standIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del stand debe ser un entero positivo."),
  })
  .strict();


export const crearStandSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  sectorId: z.number().int().positive("El ID del sector es obligatorio"), // REEMPLAZA A 'numero'
  estado: z.enum(["Disponible", "Ocupado"]).optional()
}).strict();

export const actualizarStandSchema = z.object({
  nombre: z.string().trim().min(1).optional(),
  sectorId: z.number().int().positive().optional(),
  estado: z.enum(["Disponible", "Ocupado"]).optional()
}).strict();