import express from "express";
import {
  listarEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado,
} from "../controllers/estados.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearEstadoSchema,
  actualizarEstadoSchema,
  estadoIdParamSchema,
} from "../validators/estados.schemas.js";

const router = express.Router();

router.get(
  "/",
  /* 
    #swagger.tags = ['Estados']
    #swagger.summary = "Lista todos los estados del sistema (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Listado de estados obtenido exitosamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ListaEstados" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  listarEstados
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Estados']
    #swagger.summary = "Obtiene los datos de un estado por su ID (Solo Administrador)."
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del estado en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[200] = {
      description: "Estado encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EstadoRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "ID con formato inválido.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Estado no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(estadoIdParamSchema),
  obtenerEstado
);

router.post(
  "/",
  /* 
    #swagger.tags = ['Estados']
    #swagger.summary = "Crea un nuevo estado en el sistema (Solo Administrador)."
    #swagger.auto = false
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/CrearEstado" } } }
    }
    #swagger.responses[201] = {
      description: "Estado creado exitosamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EstadoRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "Cuerpo inválido o formato incorrecto.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "Ya existe un estado con ese nombre.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarBody(crearEstadoSchema),
  crearEstado
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Estados']
    #swagger.summary = "Actualiza el nombre de un estado existente (Solo Administrador)."
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del estado en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarEstado" } } }
    }
    #swagger.responses[200] = {
      description: "Estado actualizado correctamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EstadoRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "ID o cuerpo inválido.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Estado no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "Conflicto: ya existe otro estado con ese nombre.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(estadoIdParamSchema),
  validarBody(actualizarEstadoSchema),
  actualizarEstado
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Estados']
    #swagger.summary = "Elimina un estado del sistema si no tiene inscripciones asociadas (Solo Administrador)."
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del estado en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[204] = {
      description: "Estado eliminado exitosamente."
    }
    #swagger.responses[400] = {
      description: "ID con formato inválido.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Estado no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "No se puede eliminar el estado porque existen inscripciones asociadas.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(estadoIdParamSchema),
  eliminarEstado
);

export default router;