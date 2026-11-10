import { z } from "zod";
import uuidSchema from "./UUID.schema.js";

export const rolIdParamSchema = z
  .object({ id: uuidSchema })
  .strict();

export const crearRolSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre del rol es obligatorio." })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .transform((val) => val.toUpperCase()), // Estandariza a MAYÚSCULAS (ej: "ADMIN", "ARTESANO")
  })
  .strict();

export const actualizarRolSchema = crearRolSchema;

export const RolRespuesta = {
  type: "object",
  required: ["id", "nombre"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
      example: "f49b6ec8-4138-4e98-901d-e371fbdd0c46"
    },
    nombre: {
      type: "string",
      example: "ARTESANO"
    }
  }
};

export const ListaRoles = {
  type: "array",
  items: {
    $ref: "#/components/schemas/RolRespuesta"
  }
};

export const eliminarRolSchema = rolIdParamSchema

// DTO para asignar rol
export const asignarRolSchema = rolIdParamSchema