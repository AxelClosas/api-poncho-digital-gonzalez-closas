import { z } from "zod";
import uuidSchema from "./UUID.schema.js";

const camposEditables = z
  .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(100),
    descripcion: z.string().trim().max(1000).nullable().optional(),
    rubroId: uuidSchema.nullable().optional(),
  })
  .strict();

export const crearEmprendimientoSchema = camposEditables.extend({
    usuarioId: uuidSchema.optional()
});

export const actualizarEmprendimientoSchema = camposEditables
  .partial()
  .refine(
    (datos) => Object.values(datos).some((valor) => valor !== undefined),
    "Debés enviar al menos un campo para actualizar."
  );

export const emprendimientoIdParamSchema = z
  .object({ id: uuidSchema })
  .strict();

export const consultarEmprendimientosSchema = z.object({
  busqueda: z.string().trim().min(1).max(100).optional(),
  rubroId: uuidSchema.optional(),
  standId: uuidSchema.optional(),
  usuarioId: uuidSchema.optional(),
  conStand: z.enum(["true", "false"])
    .transform((valor) => valor === "true").optional(),
  ordenPor: z.enum(["id", "nombre"]).default("id"),
  direccion: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.coerce.number().int().min(1).max(21474836).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(10),
}).strict().refine(
  (datos) => !(datos.standId !== undefined && datos.conStand === false),
  { message: "No se puede filtrar por standId y conStand=false a la vez.", path: ["conStand"] }
);
