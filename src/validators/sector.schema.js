import { z } from "zod";
import uuidSchema from "./UUID.schema.js";

export const sectorIdParamSchema = z
  .object({
    id: uuidSchema
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
    pabellonId: uuidSchema,
  })
  .strict();

export const actualizarSectorSchema = crearSectorSchema.partial();

export const consultarSectoresSchema = z.object({
    // Filtros
    nombre: z.string().trim().min(1).optional(),

    // Criterios de ordenación
    ordenPor: z.enum(["nombre"]).default("nombre"),
    direccion: z.enum(["asc", "desc"]).default("asc"),

    // Criterios de paginación
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
})