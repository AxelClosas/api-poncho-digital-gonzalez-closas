import { z } from "zod";

export const crearEmprendimientoSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),

    descripcion: z.string().trim().optional(),

}).strict();

export const actualizarEmprendimientoSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),

    descripcion: z.string().trim().optional(),

}).strict();