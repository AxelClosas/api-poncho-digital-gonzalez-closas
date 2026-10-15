import { z } from "zod";

export const crearStandSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    numero: z.string().trim().min(1, "El número es obligatorio"),
    estado: z.enum([
    "DISPONIBLE",
    "OCUPADO",
    ]).optional()
});

export const actualizarStandSchema = z.object({
    nombre: z.string().trim().min(1),
    numero: z.string().trim().min(1),
    estado: z.enum([
    "DISPONIBLE",
    "OCUPADO",
    ])
});