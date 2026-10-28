import { z } from "zod";
import uuidSchema from "./UUID.schema.js";

export const pabellonIdParamSchema = z
  .object({
    id: uuidSchema
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

export const consultarPabellonesSchema = z
  .object({
    // Filtros
    nombre: z.string().trim().min(1).optional(),

    // Criterios de ordenación
    ordenPor: z.enum(["nombre"]).default("nombre"),
    direccion: z.enum(["asc", "desc"]).default("asc"),

    // Criterios de paginación
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
  })