import { z } from "zod";

export const rolIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del rol debe ser un entero positivo."),
  })
  .strict();

export const crearRolSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del rol es obligatorio." })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .transform((val) => val.toUpperCase()), // Estandariza a MAYÚSCULAS (ej: "ADMIN", "ARTESANO")
  })
  .strict();

export const actualizarRolSchema = crearRolSchema;