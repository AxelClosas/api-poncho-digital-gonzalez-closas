import express from "express";
import {
  listarRoles,
  obtenerRol,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../controllers/roles.controller.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearRolSchema,
  actualizarRolSchema,
  rolIdParamSchema,
} from "../validators/roles.schemas.js";

const router = express.Router();


router.get("/",/*
    #swagger.auto = false
    #swagger.tags = ['Roles']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Lista los roles. Requiere rol ADMINISTRADOR."
    #swagger.description = "Devuelve un arreglo ordenado por nombre ascendente, sin paginación."

    #swagger.responses[200] = {
      description: 'Listado de roles.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ListaRoles' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Formato de autorización inválido.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }
  */
  ...soloAdmin(), listarRoles);

router.get("/:id",
  /*
    #swagger.auto = false
    #swagger.tags = ['Roles']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Obtiene un rol por UUID. Requiere rol ADMINISTRADOR."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'UUID del rol.',
      required: true,
      '@schema': {
        type: 'string',
        format: 'uuid'
      }
    }

    #swagger.responses[200] = {
      description: 'Detalle del rol.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/RolRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'UUID inválido o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Rol no encontrado.'
    }
  */
  ...soloAdmin(), validarParametros(rolIdParamSchema), obtenerRol);

router.post("/",/*
    #swagger.auto = false
    #swagger.tags = ['Roles']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Crea un rol. Requiere rol ADMINISTRADOR."
    #swagger.description = "El nombre se guarda en mayúsculas y debe ser único."

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/CrearRol' }
        }
      }
    }

    #swagger.responses[201] = {
      description: 'Rol creado correctamente.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/RolRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Cuerpo inválido o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[409] = {
      description: 'Ya existe un rol con ese nombre.'
    }
  */
  ...soloAdmin(),validarBody(crearRolSchema), crearRol);

router.put("/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Roles']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Actualiza un rol. Requiere rol ADMINISTRADOR."
    #swagger.description = "El nombre es obligatorio y se guarda en mayúsculas."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'UUID del rol que se desea actualizar.',
      required: true,
      '@schema': {
        type: 'string',
        format: 'uuid'
      }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ActualizarRol' }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Rol actualizado correctamente.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/RolRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Cuerpo o UUID inválidos, o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Rol no encontrado.'
    }

    #swagger.responses[409] = {
      description: 'Ya existe otro rol con ese nombre.'
    }
  */ 
  ...soloAdmin(), validarParametros(rolIdParamSchema), validarBody(actualizarRolSchema), actualizarRol);

router.delete("/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Roles']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Elimina un rol. Requiere rol ADMINISTRADOR."
    #swagger.description = "Solo se pueden eliminar roles que no estén asignados a usuarios."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'UUID del rol que se desea eliminar.',
      required: true,
      '@schema': {
        type: 'string',
        format: 'uuid'
      }
    }

    #swagger.responses[204] = {
      description: 'Rol eliminado correctamente. Sin cuerpo de respuesta.'
    }

    #swagger.responses[400] = {
      description: 'UUID inválido o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Rol no encontrado.'
    }

    #swagger.responses[409] = {
      description: 'No se puede eliminar el rol porque está asignado a usuarios.'
    }
  */
  ...soloAdmin(), validarParametros(rolIdParamSchema), eliminarRol);

export default router;