import { z } from "zod"
import { postularseSchema } from "../validators/inscripciones.schemas.js"
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
