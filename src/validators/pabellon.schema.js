import { z } from "zod";

export const pabellonIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del pabellón debe ser un entero positivo."),
  })
  .strict();

export const crearPabellonSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del pabellón es obligatorio." })
      .trim()
      .min(1, "El nombre del pabellón no puede estar vacío.")
      .max(100, "El nombre del pabellón no puede superar los 100 caracteres."),
    descripcion: z.string().trim().max(500, "La descripción no puede superar los 500 caracteres.").optional().nullable(),
  })
  .strict();

export const actualizarPabellonSchema = crearPabellonSchema.partial();