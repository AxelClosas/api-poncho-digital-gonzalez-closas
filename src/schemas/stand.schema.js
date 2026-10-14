import { z } from "zod";

const estadosPermitidos = [
    "DISPONIBLE",
    "OCUPADO",
];

export const crearStandSchema = z.object({
    numero: z
    .string()
    .trim()
    .min(1, "El número del stand es obligatorio"),

    estado: z
    .enum(estadosPermitidos)
    .optional()
}).strict();

export const actualizarStandSchema = z.object({
    numero: z
    .string()
    .trim()
    .min(1, "El número del stand es obligatorio"),

    estado: z.enum(estadosPermitidos)
}).strict();