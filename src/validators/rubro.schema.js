import { z } from "zod";

export const crearRubroSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),

    descripcion: z.string().trim().optional()
}).strict();

export const actualizarRubroSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),

    descripcion: z.string().trim().optional()
}).strict();