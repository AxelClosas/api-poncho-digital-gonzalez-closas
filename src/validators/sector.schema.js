import { z } from "zod";

export const sectorIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive("El ID del sector debe ser un entero positivo."),
  })
  .strict();

export const crearSectorSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del sector es obligatorio." })
      .trim()
      .min(1, "El nombre del sector no puede estar vacío.")
      .max(100, "El nombre del sector no puede superar los 100 caracteres."),
    descripcion: z
      .string()
      .trim()
      .max(500, "La descripción no puede superar los 500 caracteres.")
      .optional()
      .nullable(),
    pabellonId: z
      .number({ required_error: "El ID del pabellón es obligatorio." })
      .int()
      .positive("El ID del pabellón debe ser un entero positivo."),
  })
  .strict();

export const actualizarSectorSchema = crearSectorSchema.partial();