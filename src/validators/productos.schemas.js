import { z } from "zod";

export const productoIdParamSchema = z
  .object({
    id: z.coerce.string().uuid("El ID del producto debe ser un UUID válido."),
  })
  .strict();

export const crearProductoSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del producto es obligatorio." })
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(100, "El nombre no puede superar los 100 caracteres."),
    descripcion: z.string().trim().max(500).optional().nullable(),
    precio: z
      .number({ required_error: "El precio es obligatorio." })
      .positive("El precio debe ser un valor positivo.")
      .max(99999999.99, "El precio excede el límite permitido.")
      .transform((val) => Number(val.toFixed(2))), // Ajusta a 2 decimales para Decimal(10, 2)
  })
  .strict();

export const actualizarProductoSchema = crearProductoSchema.partial();

export const consultarProductosSchema = z.object({
  busqueda: z.string().trim().optional(),
  emprendimientoId: z.coerce.number().int().positive().optional(),
  rubroId: z.coerce.number().int().positive().optional(),
  ordenPor: z.enum(["nombre", "precio", "id"]).default("id"),
  direccion: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
});