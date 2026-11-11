import { z } from "zod"
import { postularseSchema, cambiarEstadoSchema } from "../validators/inscripciones.schemas.js"
import {
  iniciarSesionSchema,
  crearAdministradorSchema,
  cambiarActivoSchema,
} from "../validators/usuarios.schemas.js"

import { asignarRolSchema, eliminarRolSchema } from "../validators/roles.schemas.js"
import {
  crearRubroSchema,
  actualizarRubroSchema,
} from "../validators/rubro.schema.js"
import {
  crearPabellonSchema,
  actualizarPabellonSchema,
} from "../validators/pabellon.schema.js"
import {
  crearEmprendimientoSchema,
  actualizarEmprendimientoSchema,
} from "../validators/emprendimiento.schema.js"
import {
  crearEstadoSchema,
  actualizarEstadoSchema,
} from "../validators/estados.schemas.js"

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

//PRODUCTOS

export const CrearProducto = {
  type: "object",
  additionalProperties: false,
  required: ["nombre", "precio"],
  properties: {
    nombre: {
      type: "string",
      minLength: 2,
      maxLength: 100,
      example: "Poncho artesanal"
    },
    descripcion: {
      type: "string",
      nullable: true,
      maxLength: 500,
      example: "Tejido a mano con lana de oveja."
    },
    precio: {
      type: "number",
      minimum: 0,
      exclusiveMinimum: true,
      maximum: 99999999.99,
      example: 45000.50
    }
  }
};

export const ActualizarProducto = {
  type: "object",
  additionalProperties: false,
  properties: CrearProducto.properties
  };

export const Producto = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    nombre: { type: "string", example: "Poncho artesanal" },
    descripcion: { type: "string", nullable: true },
    // Prisma serializa Decimal como string en las respuestas JSON.
    precio: { type: "string", example: "45000.5" },
    emprendimientoId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  }
};

export const ProductoDetalle = {
  allOf: [
    { $ref: "#/components/schemas/Producto" },
    {
      type: "object",
      properties: {
        emprendimiento: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            nombre: { type: "string" },
            rubro: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                nombre: { type: "string" }
              }
            },
            stand: {
              type: "object",
              nullable: true,
              properties: {
                id: { type: "string", format: "uuid" },
                nombre: { type: "string" },
                estado: { type: "string" }
              }
            }
          }
        }
      }
    }
  ]
};

export const ListaProductosPaginada = {
  type: "object",
  properties: {
    productos: {
      type: "array",
      items: { $ref: "#/components/schemas/ProductoDetalle" }
    },
    paginacion: {
      type: "object",
      properties: {
        pagina: { type: "integer", example: 1 },
        limite: { type: "integer", example: 10 },
        total: { type: "integer", example: 25 },
        totalPaginas: { type: "integer", example: 3 }
      }
    }
  }
};

//SECTORES

export const CrearSector = {
  type: "object",
  additionalProperties: false,
  required: ["nombre", "pabellonId"],
  properties: {
    nombre: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      example: "Sector Textiles"
    },
    descripcion: {
      type: "string",
      nullable: true,
      maxLength: 500,
      example: "Espacio para tejidos artesanales."
    },
    pabellonId: {
      type: "string",
      format: "uuid"
    }
  }
};

export const ActualizarSector = {
  type: "object",
  additionalProperties: false,
  properties: CrearSector.properties
};

export const SectorRespuesta = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    nombre: { type: "string", example: "Sector Textiles" },
    descripcion: { type: "string", nullable: true },
    pabellonId: { type: "string", format: "uuid" },
    pabellon: {
      $ref: "#/components/schemas/PabellonRespuesta"
    }
  }
};

export const SectorDetalle = {
  allOf: [
    { $ref: "#/components/schemas/SectorRespuesta" },
    {
      type: "object",
      properties: {
        stands: {
          type: "array",
          items: { $ref: "#/components/schemas/StandBase" }
        }
      }
    }
  ]
};

export const ListaSectoresPaginada = {
  type: "object",
  properties: {
    sectores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          nombre: { type: "string" },
          pabellon: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              nombre: { type: "string" }
            }
          },
          stands: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                nombre: { type: "string" }
              }
            }
          }
        }
      }
    },
    paginacion: {
      type: "object",
      properties: {
        pagina: { type: "integer", example: 1 },
        limite: { type: "integer", example: 10 },
        total: { type: "integer", example: 20 },
        totalPaginas: { type: "integer", example: 2 }
      }
    }
  }
};

//STANDS

export const CrearStand = {
  type: "object",
  additionalProperties: false,
  required: ["nombre", "sectorId"],
  properties: {
    nombre: {
      type: "string",
      minLength: 1,
      example: "Stand A1"
    },
    sectorId: {
      type: "string",
      format: "uuid"
    },
    estado: {
      type: "string",
      enum: ["DISPONIBLE", "OCUPADO"],
      description:
        "El validador acepta este campo, pero actualmente el servicio de creación lo ignora y utiliza DISPONIBLE."
    }
  }
};

export const ActualizarStand = {
  type: "object",
  additionalProperties: false,
  properties: {
    nombre: {
      type: "string",
      minLength: 1,
      example: "Stand A2"
    },
    sectorId: {
      type: "string",
      format: "uuid"
    },
    estado: {
      type: "string",
      enum: ["DISPONIBLE", "OCUPADO"],
      example: "DISPONIBLE"
    }
  }
};

export const StandBase = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    nombre: { type: "string", example: "Stand A1" },
    estado: {
      type: "string",
      enum: ["DISPONIBLE", "OCUPADO"]
    },
    sectorId: { type: "string", format: "uuid" }
  }
};

export const StandDetalle = {
  allOf: [
    { $ref: "#/components/schemas/StandBase" },
    {
      type: "object",
      properties: {
        sector: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            nombre: { type: "string" },
            descripcion: { type: "string", nullable: true },
            pabellonId: { type: "string", format: "uuid" }
          }
        }
      }
    }
  ]
};

export const ListaStands = {
  type: "array",
  items: {
    type: "object",
    properties: {
      nombre: { type: "string", example: "Stand A1" },
      sector: {
        type: "object",
        properties: {
          nombre: { type: "string", example: "Sector Textiles" },
          pabellon: {
            type: "object",
            properties: {
              nombre: {
                type: "string",
                example: "Pabellón Artesanías"
              }
            }
          }
        }
      }
    }
  }
};


// ROLES
export const CrearRol = {
  type: "object",
  additionalProperties: false,
  required: ["nombre"],
  properties: {
    nombre: {
      type: "string",
      minLength: 3,
      maxLength: 50,
      description: "Se eliminan espacios de los extremos y se convierte a mayusculas.",
      example: "ARTESANO"
    }
  }
};

export const ActualizarRol = { ...CrearRol };

export const RolRespuesta = {
  type: "object",
  required: ["id", "nombre"],
  properties: {
    id: { type: "string", format: "uuid" },
    nombre: { type: "string", example: "ARTESANO" }
  }
};

export const ListaRoles = {
  type: "array",
  items: { $ref: "#/components/schemas/RolRespuesta" }
};

// RUBROS
export const CrearRubro = {
  ...z.toJSONSchema(crearRubroSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Textil",
    descripcion: "Tejidos y productos textiles artesanales.",
  },
};

export const ActualizarRubro = {
  ...z.toJSONSchema(actualizarRubroSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    descripcion: "Tejidos artesanales en lana e hilo.",
  },
};

export const RubroRespuesta = {
  type: "object",
  required: ["id", "nombre", "descripcion"],
  properties: {
    id: { type: "string", format: "uuid" },
    nombre: { type: "string", example: "Textil" },
    descripcion: {
      type: "string",
      nullable: true,
      example: "Tejidos y productos textiles artesanales.",
    },
  },
};

export const RubroDetalle = {
  allOf: [
    { $ref: "#/components/schemas/RubroRespuesta" },
    {
      type: "object",
      required: ["emprendimientos"],
      properties: {
        emprendimientos: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "nombre"],
            properties: {
              id: { type: "string", format: "uuid" },
              nombre: { type: "string", example: "Tejidos del Valle" },
            },
          },
        },
      },
    },
  ],
};

export const ListaRubros = {
  type: "array",
  items: { $ref: "#/components/schemas/RubroRespuesta" },
};

/* INSCRIPCIONES */
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

/* EMPRENDIMIENTOS */
export const CrearEmprendimiento = {
  ...z.toJSONSchema(crearEmprendimientoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Tejidos del Valle",
    descripcion: "Elaboración de ponchos y prendas tradicionales en telar criollo.",
    rubroId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  },
};

export const ActualizarEmprendimiento = {
  ...z.toJSONSchema(actualizarEmprendimientoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Tejidos del Valle - Artesanías",
    descripcion: "Prendas de vicuña y llama tejidas artesanalmente.",
    rubroId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  },
};

export const EmprendimientoRespuesta = {
  type: "object",
  required: ["id", "nombre", "rubroId"],
  properties: {
    id: { type: "string", format: "uuid", example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" },
    nombre: { type: "string", example: "Tejidos del Valle" },
    descripcion: { type: "string", nullable: true, example: "Elaboración de ponchos y prendas en telar." },
    rubroId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
    standId: { type: "string", format: "uuid", nullable: true, example: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
    rubro: {
      type: "object",
      required: ["id", "nombre"],
      properties: {
        id: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
        nombre: { type: "string", example: "Textil" },
      },
    },
    stand: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "string", format: "uuid", example: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
        nombre: { type: "string", example: "Stand A1" },
        estado: { type: "string", enum: ["DISPONIBLE", "OCUPADO"], example: "OCUPADO" },
      },
    },
  },
};

export const ListaEmprendimientosPaginada = {
  type: "object",
  required: ["emprendimientos", "paginacion"],
  properties: {
    emprendimientos: {
      type: "array",
      items: { $ref: "#/components/schemas/EmprendimientoRespuesta" },
    },
    paginacion: {
      type: "object",
      required: ["pagina", "limite", "total", "totalPaginas"],
      properties: {
        pagina: { type: "integer", example: 1 },
        limite: { type: "integer", example: 10 },
        total: { type: "integer", example: 35 },
        totalPaginas: { type: "integer", example: 4 },
      },
    },
  },
};

export const EmprendimientoCreado = {
  type: "object",
  required: ["nuevoEmprendimiento", "nuevaInscripcion"],
  properties: {
    nuevoEmprendimiento: {
      type: "object",
      required: ["id", "nombre", "rubroId", "usuarioId"],
      properties: {
        id: { type: "string", format: "uuid", example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" },
        nombre: { type: "string", example: "Tejidos del Valle" },
        descripcion: { type: "string", nullable: true, example: "Elaboración de ponchos y prendas tradicionales." },
        rubroId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
        usuarioId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
        standId: { type: "string", format: "uuid", nullable: true, example: null },
        createdAt: { type: "string", format: "date-time", example: "2026-11-10T20:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-11-10T20:00:00.000Z" },
      },
    },
    nuevaInscripcion: {
      type: "object",
      required: ["id", "nroEdicion", "nroTramite", "estadoId", "usuarioId"],
      properties: {
        id: { type: "string", format: "uuid", example: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
        nroEdicion: { type: "integer", example: 2026 },
        nroTramite: { type: "integer", example: 1042 },
        observaciones: { type: "string", nullable: true, example: null },
        createdAt: { type: "string", format: "date-time", example: "2026-11-10T20:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-11-10T20:00:00.000Z" },
      },
    },
  },
};

/* ESTADOS */
export const CrearEstado = {
  ...z.toJSONSchema(crearEstadoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "aprobado",
  },
};

export const ActualizarEstado = {
  ...z.toJSONSchema(actualizarEstadoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "rechazado",
  },
};

export const EstadoRespuesta = {
  type: "object",
  required: ["id", "nombre"],
  properties: {
    id: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    nombre: { type: "string", example: "nuevo" },
  },
};

export const ListaEstados = {
  type: "array",
  items: { $ref: "#/components/schemas/EstadoRespuesta" },
};

/* REPORTES Y ESTADÍSTICAS */
export const ReporteArtesanosRespuesta = {
  type: "object",
  required: ["metricas", "artesanos"],
  properties: {
    metricas: {
      type: "object",
      required: ["totalArtesanos", "habilitados", "inhabilitados", "conEmprendimiento", "sinEmprendimiento"],
      properties: {
        totalArtesanos: { type: "integer", example: 45 },
        habilitados: { type: "integer", example: 42 },
        inhabilitados: { type: "integer", example: 3 },
        conEmprendimiento: { type: "integer", example: 40 },
        sinEmprendimiento: { type: "integer", example: 5 },
      },
    },
    artesanos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          nombreCompleto: { type: "string", example: "Tejerina, Mariana" },
          email: { type: "string", format: "email", example: "artesano1@poncho.com" },
          cuil: { type: "string", example: "27351112224" },
          activo: { type: "boolean", example: true },
          habilitado: { type: "boolean", example: true },
          localidad: { type: "string", example: "San Fernando del Valle de Catamarca (Capital)" },
          emprendimiento: { type: "string", nullable: true, example: "Telares del Valle Calchaquí" },
          rubro: { type: "string", nullable: true, example: "TEJIDO" },
          stand: { type: "string", nullable: true, example: "Stand D-01" },
          fechaRegistro: { type: "string", format: "date-time", example: "2026-11-10T20:00:00.000Z" },
        },
      },
    },
  },
};

export const ReporteArtesanosPorLocalidadRespuesta = {
  type: "array",
  items: {
    type: "object",
    required: ["localidadId", "localidad", "departamento", "provincia", "totalArtesanos"],
    properties: {
      localidadId: { type: "string", example: "10049030" },
      localidad: { type: "string", example: "San Fernando del Valle de Catamarca" },
      departamento: { type: "string", example: "Capital" },
      provincia: { type: "string", example: "Catamarca" },
      totalArtesanos: { type: "integer", example: 18 },
    },
  },
};

export const ReporteArtesanosPorRubroRespuesta = {
  type: "object",
  required: ["totalEmprendimientos", "distribucion"],
  properties: {
    totalEmprendimientos: { type: "integer", example: 25 },
    distribucion: {
      type: "array",
      items: {
        type: "object",
        required: ["rubroId", "rubro", "totalEmprendimientos", "porcentaje"],
        properties: {
          rubroId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
          rubro: { type: "string", example: "TEJIDO" },
          descripcion: { type: "string", nullable: true, example: "Tejidos tradicionales del telar" },
          totalEmprendimientos: { type: "integer", example: 12 },
          porcentaje: { type: "string", example: "48.0%" },
        },
      },
    },
  },
};

export const ReporteOcupacionStandsRespuesta = {
  type: "object",
  required: ["totalStands", "disponibles", "ocupados", "porcentajeOcupacion", "porPabellon"],
  properties: {
    totalStands: { type: "integer", example: 50 },
    disponibles: { type: "integer", example: 35 },
    ocupados: { type: "integer", example: 15 },
    porcentajeOcupacion: { type: "string", example: "30.0%" },
    porPabellon: {
      type: "array",
      items: {
        type: "object",
        required: ["pabellonId", "pabellon", "totalStands", "disponibles", "ocupados", "porcentajeOcupacion"],
        properties: {
          pabellonId: { type: "string", format: "uuid", example: "c1f7b876-0f79-4d2b-a0ea-75a7c2b42901" },
          pabellon: { type: "string", example: "Pabellón Poncho Diseño" },
          totalStands: { type: "integer", example: 25 },
          disponibles: { type: "integer", example: 15 },
          ocupados: { type: "integer", example: 10 },
          porcentajeOcupacion: { type: "string", example: "40.0%" },
        },
      },
    },
  },
};

export const ReporteProductosPorArtesanoRespuesta = {
  type: "array",
  items: {
    type: "object",
    required: ["emprendimientoId", "emprendimiento", "artesano", "email", "habilitado", "totalProductos", "precioPromedio"],
    properties: {
      emprendimientoId: { type: "string", format: "uuid", example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" },
      emprendimiento: { type: "string", example: "Telares del Valle Calchaquí" },
      artesano: { type: "string", example: "Tejerina, Mariana" },
      email: { type: "string", format: "email", example: "artesano1@poncho.com" },
      habilitado: { type: "boolean", example: true },
      rubro: { type: "string", example: "TEJIDO" },
      stand: { type: "string", example: "Stand D-01" },
      totalProductos: { type: "integer", example: 3 },
      precioPromedio: { type: "number", example: 41166.83 },
    },
  },
};

export const ReporteTendenciasBusquedaRespuesta = {
  type: "object",
  required: ["periodoDias", "entidadFiltro", "totalConsultasPeriodo", "ranking"],
  properties: {
    periodoDias: { type: "integer", example: 30 },
    entidadFiltro: { type: "string", example: "TODAS" },
    totalConsultasPeriodo: { type: "integer", example: 296 },
    ranking: {
      type: "array",
      items: {
        type: "object",
        required: ["posicion", "termino", "totalConsultas", "porcentaje"],
        properties: {
          posicion: { type: "integer", example: 1 },
          termino: { type: "string", example: "poncho" },
          totalConsultas: { type: "integer", example: 142 },
          porcentaje: { type: "string", example: "48.0%" },
        },
      },
    },
  },
};
