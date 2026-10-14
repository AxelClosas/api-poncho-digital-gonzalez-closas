import { z } from "zod";

export const crearPabellonSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),

    descripcion: z.string().trim().optional().nullable()}).strict();

export const actualizarPabellonSchema = crearPabellonSchema;