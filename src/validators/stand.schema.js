import { z } from "zod";
import uuidSchema from "./UUID.schema.js";


export const standIdParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();


export const crearStandSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  sectorId: uuidSchema,
  estado: z.enum(["DISPONIBLE", "OCUPADO"]).optional()
}).strict();

export const actualizarStandSchema = z.object({
  nombre: z.string().trim().min(1).optional(),
  sectorId: uuidSchema.optional(),
  estado: z.enum(["DISPONIBLE", "OCUPADO"]).optional()
}).strict();