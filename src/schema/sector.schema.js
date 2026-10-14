
import { z } from "zod";

export const crearSectorSchema = z.object({
    nombre: z
    .string()
    .trim()
    .min(1, "El nombre del sector es obligatorio"),

    descripcion: z
    .string()
    .trim()
    .optional()
    .nullable()
}).strict();

export const actualizarSectorSchema = crearSectorSchema;