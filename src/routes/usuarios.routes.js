import express from "express";
import {
  crearAdministrador,
  iniciarSesion,
  consultarUsuarios,
  obtenerUsuarioPorId,
  obtenerMiPerfil,
  cambiarEstadoActivo,
  agregarRol,
  eliminarRol,
} from "../controllers/usuarios.controller.js";

import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario
} from "../middlewares/autorizacion.middleware.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarConsulta,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearAdministradorSchema,
  iniciarSesionSchema,
  consultarUsuariosSchema,
  usuarioIdParamSchema,
  cambiarActivoSchema,
} from "../validators/usuarios.schemas.js";

import { cerrarSesion } from "../controllers/sesiones.controller.js";


import { rolIdParamSchema, asignarRolSchema } from "../validators/roles.schemas.js";

const router = express.Router();

// CONSULTAR USUARIOS
router.get(
  "/",
  /* 
    
    #swagger.summary = "Permite a un usuario con rol ADMINISTRADOR consultar usuarios con filtros y paginación."

    #swagger.parameters['busqueda'] = { 
      in: 'query', 
      description: 'Permite buscar usuarios por nombre, apellido, email o cuil', 
      type: 'string', 
      required: false 
    }

    #swagger.parameters['rol'] = { 
      in: 'query', 
      description: 'Permite filtrar usuarios por rol', 
      type: 'string',
      required: false 
    }

    #swagger.parameters['activo'] = { 
      in: 'query', 
      description: 'Permite filtrar usuarios por estado activo/inactivo', 
      type: 'string',
      schema: {
        '@enum': ['true', 'false']
      },
      required: false 
    }

    #swagger.parameters['localidadId'] = { 
      in: 'query', 
      description: 'Permite filtrar usuarios por localidad (ID numérico)', 
      type: 'string',
      required: false 
    }

    #swagger.parameters['ordenPor'] = { 
      in: 'query', 
      description: 'Campo por el cual ordenar los resultados', 
      type: 'string', 
      schema: {
        '@enum': ['nombre', 'email', 'createdAt']
      },
      default: 'createdAt',
      required: false 
    }

    #swagger.parameters['direccion'] = { 
      in: 'query', 
      description: 'Dirección de ordenamiento', 
      type: 'string', 
      schema: {
        '@enum': ['asc', 'desc']
      },
      default: 'asc',
      required: false 
    }

    #swagger.parameters['pagina'] = { 
      in: 'query', 
      description: 'Número de página para paginación', 
      type: 'integer', 
      default: 1,
      required: false 
    }

    #swagger.parameters['limite'] = { 
      in: 'query', 
      description: 'Cantidad de resultados por página (máx. 50)', 
      type: 'integer', 
      default: 10,
      required: false 
    }

    #swagger.responses[200] = {
      description: 'Lista de usuarios paginada obtenida con éxito.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ListaUsuariosPaginada" }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Parámetros de consulta inválidos.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Token ausente, inválido o revocado.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  ...soloAdmin(),
  validarConsulta(consultarUsuariosSchema),
  consultarUsuarios
);

// 2. Ruta para obtener el perfil propio del usuario autenticado
router.get(
  "/me",
  /* 
    
    #swagger.summary = "Obtiene los datos del perfil del usuario actualmente autenticado."
    #swagger.responses[200] = {
      description: "Perfil de usuario obtenido con éxito.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioDetalle" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o expirado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "La cuenta de usuario se encuentra inhabilitada.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Usuario no encontrado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  obtenerMiPerfil
);

// 1. Ruta pública de acceso
router.post(
  "/login",
  /* 
    #swagger.security = [{}]
    
    #swagger.summary = "Permite a un usuario iniciar sesión con una cuenta activa."
    #swagger.auto = false

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/IniciarSesion" }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Inicio de sesión exitoso.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioAutenticado" }
        }
      }
    }

    #swagger.responses[400] = {
      description: "Datos enviados inválidos.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }

    #swagger.responses[401] = {
      description: "Credenciales inválidas o cuenta inactiva.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  validarBody(iniciarSesionSchema),
  iniciarSesion
);

router.post(
  "/logout",
  /* 
    
    #swagger.summary = "Cierra la sesión del usuario revocando el token JWT actual."
    #swagger.responses[204] = {
      description: "Sesión cerrada exitosamente (sin contenido)."
    }
    #swagger.responses[400] = {
      description: "Formato de autorización inválido.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  autenticarUsuario,
  cerrarSesion
);

// 3. Rutas protegidas exclusivas de Administración
// Crear ADMIN
router.post(
  "/administradores",
  /* 
    
    #swagger.summary = "Permite a un ADMINISTRADOR registrar un nuevo usuario administrador."
    #swagger.auto = false

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CrearAdministrador" }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Administrador creado exitosamente.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioDetalle" }
        }
      }
    }

    #swagger.responses[400] = {
      description: "Datos inválidos, o el email/CUIL ya está registrado, o la localidad no existe.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }

    #swagger.responses[401] = {
      description: "Token ausente o inválido.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }

    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  ...soloAdmin(),
  validarBody(crearAdministradorSchema),
  crearAdministrador
);

// OBTENER USUARIO POR ID
router.get(
  "/:id",
  /* 
    
    #swagger.summary = "Permite a un ADMINISTRADOR consultar un usuario por su ID (UUID)."
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de usuario en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[200] = {
      description: "Usuario obtenido con éxito.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioDetalle" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "ID de usuario inválido (debe ser un UUID válido).",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Token ausente o inválido.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Usuario no encontrado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  obtenerUsuarioPorId
);

// CAMBIAR ESTADO ACTIVO - ACTIVAR CUENTA DE USUARIO
router.patch(
  "/:id/activo",
  /* 
    
    #swagger.summary = "Permite a un ADMINISTRADOR habilitar o inhabilitar una cuenta de usuario."
    #swagger.auto = false

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de usuario en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CambiarActivo" }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Estado de activación actualizado con éxito.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioActivoActualizado" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Parámetros o cuerpo inválidos.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Token ausente o inválido.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Usuario no encontrado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[409] = {
      description: "Conflicto: No se puede desactivar al único administrador activo del sistema.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  validarBody(cambiarActivoSchema),
  cambiarEstadoActivo
);

// ASIGNAR NUEVO ROL A USUARIO
router.post(
  "/:id/roles",
  /* 
    
    #swagger.summary = "Permite a un ADMINISTRADOR asignar un rol adicional a un usuario."
    #swagger.auto = false

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de usuario en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/AsignarRol" }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Rol asignado exitosamente.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/MensajeRespuesta" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "El rol indicado no existe o datos inválidos.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Token ausente o inválido.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Usuario no encontrado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorApi" }
        }
      }
    }
  */
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  validarBody(asignarRolSchema),
  agregarRol
);


// Compatibilidad para DELETE /:id/roles
router.delete(
  "/:id/roles",
  /* 
  #swagger.summary = "Permite a un ADMINISTRADOR retirar un rol específico a un usuario."

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/EliminarRol" }
      }
    }
  }

  #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID del usuario en formato UUID',
    required: true,
    type: 'string',
    format: 'uuid'
  }

  #swagger.responses[200] = {
    description: "Rol retirado exitosamente.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/MensajeRespuesta" } } }
  }
  #swagger.responses[400] = {
    description: "Parámetros inválidos o el usuario no tiene asignado dicho rol.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente, inválido o revocado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: requiere rol ADMINISTRADOR.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Usuario o rol no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[409] = {
    description: "Conflicto: El usuario debe conservar al menos un rol, o no se puede retirar el rol al único administrador del sistema.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  validarBody(rolIdParamSchema),
  eliminarRol
);

export default router;