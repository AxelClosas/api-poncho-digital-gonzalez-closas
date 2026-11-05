import { z } from "zod"
import { postularseSchema } from "../validators/inscripciones.schemas.js"
import { iniciarSesionSchema } from "../validators/usuarios.schemas.js"

export const NuevaPostulacion = {
  ...z.toJSONSchema(postularseSchema, {
    target: "openapi-3.0",
    io: "input",
    // Error: Date cannot be represented in JSON Schema
    // at handleUnrepresentable
    unrepresentable: {
      type: "string",
      description: "Tipo de dato no representable en OpenAPI 3.0, se serializa como string."
    }
  }),
  example: {
    "nombre": "Juan",
    "apellido": "Pérez",
    "cuil": "20123456789",
    "fechaNacimiento": "2000-11-01T18:00:00Z",
    "sexo": "M",
    "email": "usuario@ejemplo.com",
    "password": "Secret123!",
    "localidadId": "6049040",
    "emprendimiento": {
      "nombre": "Panadería Central",
      "descripcion": "Venta de productos panificados artesanales.",
      "rubroId": "2a49ad7b-e0d9-4649-8214-7042f913c0bf"
    }
  }
}

export const ErrorApi = {
  type: "object",
  required: ["mensaje"],
  properties: {
  mensaje: { type: "string" }
  }
};


export const PostulacionCreada = {
  type: "object",
  required: [ "nombre", "apellido", "cuil", "fechaNacimiento",
    "sexo", "email", "password", "localidadId", "emprendimiento"
  ],
  additionalProperties: false,
  properties: {
    nombre: {
      type: "string",
      minLength: 2,
      example: "Juan"
    },
    apellido: {
      type: "string",
      minLength: 2,
      example: "Pérez"
    },
    cuil: {
      type: "string",
      pattern: "^\\d{2}-?\\d{8}-?\\d{1}$|^\\d{11}$",
      description: "CUIL de 11 dígitos, con o sin guiones (ej. 20123456789 o 20-12345678-9).",
      example: "20123456789"
    },
    fechaNacimiento: {
      type: "string",
      format: "date-time",
      description: "Fecha en formato ISO 8601.",
      example: "2000-11-01T18:00:00Z"
    },
    sexo: {
      type: "string",
      minLength: 1,
      example: "M"
    },
    email: {
      type: "string",
      format: "email",
      example: "usuario@ejemplo.com"
    },
    localidadId: {
      type: "string",
      pattern: "^\\d+$",
      description: "ID numérico de la localidad enviado como cadena/número y parseado a entero grande (BigInt).",
      example: "42"
    },
    emprendimiento: {
      type: "object",
      required: [
        "nombre",
        "rubroId"
      ],
      additionalProperties: false,
      properties: {
        nombre: {
          type: "string",
          minLength: 2,
          example: "Panadería Central"
        },
        descripcion: {
          type: "string",
          maxLength: 1000,
          nullable: true,
          example: "Venta de productos panificados artesanales."
        },
        rubroId: {
          type: "string",
          example: "00a1dv45-dx19-2301-2471-223932594567"
        }
      }
    }
  }
}


/* USUARIOS */
export const IniciarSesion = {
  ...z.toJSONSchema(iniciarSesionSchema, {
    target: "openapi-3.0",
    io: "input"
  }),
  example: {
    email: "admin@poncho.com",
    password: "ContraseñaSegura2026!"
  }
}

export const UsuarioAutenticado = {
  type: "object",
  required: ["mensaje", "usuario", "token"],
  additionalProperties: false,
  properties: {
    mensaje: { type: "string" },
    usuario: {
      required: ["id", "nombre", "apellido", "email", "roles"],
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        roles: { type: "array", items: { type: "string" } }
      }
  },
  token: { type: "string" },
}
}