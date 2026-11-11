import { z } from "zod"
import { postularseSchema, cambiarEstadoSchema } from "../validators/inscripciones.schemas.js"
import {
  iniciarSesionSchema,
  crearAdministradorSchema,
  cambiarActivoSchema,
} from "../validators/usuarios.schemas.js"

import { asignarRolSchema, eliminarRolSchema } from "../validators/roles.schemas.js"
import {
  crearPabellonSchema,
  actualizarPabellonSchema,
} from "../validators/pabellon.schema.js"

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
  required: ["nombre", "apellido", "cuil", "fechaNacimiento",
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


export const CambiarEstadoInscripcion = {
  ...z.toJSONSchema(cambiarEstadoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    estadoId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    standId: "4fa85f64-5717-4562-b3fc-2c963f66afa6",
    observaciones: "Postulación aprobada. Se asigna stand solicitado.",
  },
};

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

// export const ConsultarUsuarios = {
//   ...z.toJSONSchema(consultarUsuariosSchema, {
//     target: "openapi-3.0",
//     io: "input"
//   })
// }

export const CrearAdministrador = {
  ...z.toJSONSchema(crearAdministradorSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: {
      type: "string",
      description: "Tipo de dato no representable en OpenAPI 3.0, se serializa como string.",
    },
  }),
  example: {
    nombre: "Carlos",
    apellido: "González",
    email: "carlos.admin@poncho.gob.ar",
    password: "PasswordSeguro2026!",
    cuil: "20-30123456-7",
    sexo: "M",
    fechaNacimiento: "1988-05-14T00:00:00Z",
    localidadId: "10049030",
  },
};

export const CambiarActivo = {
  ...z.toJSONSchema(cambiarActivoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    activo: true,
  },
};

export const AsignarRol = {
  ...z.toJSONSchema(asignarRolSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "ADMINISTRADOR",
  },
};

export const EliminarRol = {
  ...z.toJSONSchema(eliminarRolSchema, {
    target: "openapi-3.0",
    io: "input",
  })
}

export const UsuarioDetalle = {
  type: "object",
  required: [
    "id",
    "nombre",
    "apellido",
    "cuil",
    "fechaNacimiento",
    "sexo",
    "email",
    "activo",
    "createdAt",
    "roles",
  ],
  properties: {
    id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
    nombre: { type: "string", example: "Juan" },
    apellido: { type: "string", example: "Pérez" },
    cuil: { type: "string", example: "20-12345678-9" },
    fechaNacimiento: { type: "string", format: "date-time", example: "1995-04-12T00:00:00.000Z" },
    sexo: { type: "string", enum: ["M", "F"], example: "M" },
    email: { type: "string", format: "email", example: "usuario@ejemplo.com" },
    activo: { type: "boolean", example: true },
    ultimoAcceso: { type: "string", format: "date-time", nullable: true, example: "2026-11-10T02:00:00.000Z" },
    createdAt: { type: "string", format: "date-time", example: "2026-10-15T14:30:00.000Z" },
    localidad: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "integer", example: 10049030 },
        nombre: { type: "string", example: "San Fernando del Valle de Catamarca" },
        departamento: {
          type: "object",
          properties: {
            id: { type: "integer", example: 10049 },
            nombre: { type: "string", example: "Capital" },
            provincia: {
              type: "object",
              properties: {
                id: { type: "integer", example: 10 },
                nombre: { type: "string", example: "Catamarca" },
              },
            },
          },
        },
      },
    },
    roles: {
      type: "array",
      items: { type: "string" },
      example: ["ADMINISTRADOR"],
    },
    emprendimiento: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
        nombre: { type: "string", example: "Tejidos del Valle" },
        rubro: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            nombre: { type: "string", example: "Textil" },
          },
        },
        stand: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "string", format: "uuid" },
            nombre: { type: "string", example: "Stand A-12" },
            estado: { type: "string", example: "ASIGNADO" },
          },
        },
      },
    },
  },
};

export const ListaUsuariosPaginada = {
  type: "object",
  required: ["usuarios", "paginacion"],
  properties: {
    usuarios: {
      type: "array",
      items: { $ref: "#/components/schemas/UsuarioDetalle" },
    },
    paginacion: {
      type: "object",
      required: ["pagina", "limite", "total", "totalPaginas"],
      properties: {
        pagina: { type: "integer", example: 1 },
        limite: { type: "integer", example: 10 },
        total: { type: "integer", example: 45 },
        totalPaginas: { type: "integer", example: 5 },
      },
    },
  },
};

export const UsuarioActivoActualizado = {
  type: "object",
  required: ["id", "nombre", "apellido", "email", "activo"],
  properties: {
    id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
    nombre: { type: "string", example: "Juan" },
    apellido: { type: "string", example: "Pérez" },
    email: { type: "string", format: "email", example: "juan@ejemplo.com" },
    activo: { type: "boolean", example: false },
  },
};

export const MensajeRespuesta = {
  type: "object",
  required: ["mensaje"],
  properties: {
    mensaje: { type: "string", example: "Operación realizada exitosamente." },
  },
};

/* PABELLONES */
export const CrearPabellon = {
  ...z.toJSONSchema(crearPabellonSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Pabellón Artesanías Tradicionales",
    descripcion: "Espacio dedicado a artesanos tradicionales del telar, madera y cuero.",
  },
};

export const ActualizarPabellon = {
  ...z.toJSONSchema(actualizarPabellonSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Pabellón Artesanías y Diseño",
    descripcion: "Espacio renovado para exposiciones textiles y diseño contemporáneo.",
  },
};

export const PabellonRespuesta = {
  type: "object",
  required: ["id", "nombre"],
  properties: {
    id: { type: "string", format: "uuid", example: "c1f7b876-0f79-4d2b-a0ea-75a7c2b42901" },
    nombre: { type: "string", example: "Pabellón Artesanías Tradicionales" },
    descripcion: { type: "string", nullable: true, example: "Espacio dedicado a artesanos tradicionales." },
  },
};

export const PabellonDetalle = {
  type: "object",
  required: ["id", "nombre", "sectores"],
  properties: {
    id: { type: "string", format: "uuid", example: "c1f7b876-0f79-4d2b-a0ea-75a7c2b42901" },
    nombre: { type: "string", example: "Pabellón Artesanías Tradicionales" },
    descripcion: { type: "string", nullable: true, example: "Espacio dedicado a artesanos tradicionales." },
    sectores: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "nombre"],
        properties: {
          id: { type: "string", format: "uuid", example: "e4f8d910-1a2b-3c4d-5e6f-7a8b9c0d1e2f" },
          nombre: { type: "string", example: "Sector A" },
          descripcion: { type: "string", nullable: true, example: "Área de exposición textil" },
        },
      },
    },
  },
};

export const ListaPabellonesPaginada = {
  type: "object",
  required: ["pabellones", "paginacion"],
  properties: {
    pabellones: {
      type: "array",
      items: { $ref: "#/components/schemas/PabellonDetalle" },
    },
    paginacion: {
      type: "object",
      required: ["pagina", "limite", "total", "totalPaginas"],
      properties: {
        pagina: { type: "integer", example: 1 },
        limite: { type: "integer", example: 10 },
        total: { type: "integer", example: 12 },
        totalPaginas: { type: "integer", example: 2 },
      },
    },
  },
};

export const ReinscripcionCreada = {
  type: "object",
  required: ["mensaje", "inscripcion"],
  properties: {
    mensaje: {
      type: "string",
      example: "Inscripción registrada con éxito para la edición 2026. Su postulación se encuentra pendiente de revisión.",
    },
    inscripcion: {
      type: "object",
      required: ["id", "nroEdicion", "nroTramite", "estadoId", "usuarioId"],
      properties: {
        id: { type: "string", format: "uuid", example: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
        nroEdicion: { type: "integer", example: 2026 },
        nroTramite: { type: "integer", example: 1042 },
        observaciones: { type: "string", nullable: true, example: null },
        createdAt: { type: "string", format: "date-time", example: "2026-11-10T21:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-11-10T21:00:00.000Z" },
        estado: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
            nombre: { type: "string", example: "nuevo" },
          },
        },
      },
    },
  },
};

export const InscripcionActualizada = {
  type: "object",
  required: ["id", "nroEdicion", "nroTramite", "estadoId", "usuarioId"],
  properties: {
    id: { type: "string", format: "uuid", example: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
    nroEdicion: { type: "integer", example: 2026 },
    nroTramite: { type: "integer", example: 1042 },
    observaciones: { type: "string", nullable: true, example: "Postulación aprobada. Se asigna stand solicitado." },
    evaluadorId: { type: "string", format: "uuid", nullable: true, example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
    estado: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
        nombre: { type: "string", example: "aprobado" },
      },
    },
    evaluador: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
        nombre: { type: "string", example: "Carlos" },
        apellido: { type: "string", example: "Administrador" },
        email: { type: "string", format: "email", example: "admin@poncho.gob.ar" },
      },
    },
  },
};