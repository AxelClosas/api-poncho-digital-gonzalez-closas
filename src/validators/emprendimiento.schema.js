import { z } from "zod";

const idEntero = z.number().int().positive().max(2147483647);

const camposEditables = z
    .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(100),
    descripcion: z.string().trim().max(1000).nullable().optional(),
    rubroId: idEntero.nullable().optional(),
    })
    .strict();

export const crearEmprendimientoSchema = camposEditables.extend({
    usuarioId: z.string().uuid("El usuarioId debe ser un UUID válido."),
});

export const actualizarEmprendimientoSchema = camposEditables
    .partial()
    .refine(
    (datos) => Object.values(datos).some((valor) => valor !== undefined),
    "Debés enviar al menos un campo para actualizar."
    );

export const emprendimientoIdParamSchema = z
    .object({
    id: z.coerce
        .number()
        .int()
        .positive("El ID debe ser un número entero positivo.")
        .max(2147483647, "El ID está fuera del rango permitido.")
    })
    .strict();

export const consultarEmprendimientosSchema = z.object({
    busqueda: z.string().trim().min(1).max(100).optional(),
    rubroId: z.coerce.number().int().positive().max(2147483647).optional(),
    standId: z.coerce.number().int().positive().max(2147483647).optional(),
    usuarioId: z.string().uuid().optional(),
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
