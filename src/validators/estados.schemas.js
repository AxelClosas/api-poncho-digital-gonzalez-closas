import { z } from "zod";

export const estadoIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del estado debe ser un entero positivo."),
  })
  .strict();

export const crearEstadoSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del estado es obligatorio." })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .transform((val) => val.toLowerCase()), // Estandariza a minúsculas (ej: "nuevo", "aprobado")
  })
  .strict();

export const actualizarEstadoSchema = crearEstadoSchema;