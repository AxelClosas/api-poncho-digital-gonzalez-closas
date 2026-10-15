import { z } from "zod";

export const rubroIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del rubro debe ser un entero positivo."),
  })
  .strict();

export const crearRubroSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del rubro es obligatorio." })
      .trim()
      .min(1, "El nombre del rubro no puede estar vacío.")
      .max(100, "El nombre del rubro no puede superar los 100 caracteres."),
    descripcion: z
      .string()
      .trim()
      .max(500, "La descripción no puede superar los 500 caracteres.")
      .optional()
      .nullable(),
  })
  .strict();

export const actualizarRubroSchema = crearRubroSchema.partial();