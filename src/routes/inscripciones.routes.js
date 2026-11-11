import express from "express";
import {
  postularse,
  consultarInscripciones,
  cambiarEstadoInscripcion,
  inscribirseNuevaEdicion,
} from "../controllers/inscripciones.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

import {
  validarBody,
  validarConsulta,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  postularseSchema,
  consultarInscripcionesSchema,
  cambiarEstadoSchema,
  inscripcionIdParamSchema,
} from "../validators/inscripciones.schemas.js";

const router = express.Router();

const artesanoOAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO", "ADMINISTRADOR"),
];

// 2. Consulta de trámites (requiere rol Administrador)
router.get(
  "/",
  /*
    #swagger.tags = ['Inscripciones']
    #swagger.summary = "Consulta y filtra las inscripciones del festival con paginación (Solo Administrador)."
    #swagger.auto = false
    #swagger.parameters['nroEdicion'] = { in: 'query', type: 'integer', description: 'Filtrar por año de edición (ej. 2026)' }
    #swagger.parameters['estadoId'] = { in: 'query', type: 'string', format: 'uuid', description: 'Filtrar por ID del estado' }
    #swagger.parameters['busqueda'] = { in: 'query', type: 'string', description: 'Búsqueda por texto (nombre, apellido, email, cuil, nombre de emprendimiento)' }
    #swagger.parameters['ordenPor'] = { in: 'query', type: 'string', enum: ['createdAt', 'nroTramite'], default: 'createdAt' }
    #swagger.parameters['direccion'] = { in: 'query', type: 'string', enum: ['asc', 'desc'], default: 'desc' }
    #swagger.parameters['pagina'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limite'] = { in: 'query', type: 'integer', default: 10 }
    #swagger.responses[200] = {
      description: "Listado paginado de inscripciones obtenido exitosamente.",
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarConsulta(consultarInscripcionesSchema),
  consultarInscripciones
);

// 1. Postulación pública (abierta a postulantes)
router.post("/postularse",
  /*
  #swagger.tags = ['Inscripciones']
  #swagger.security = [{}]
  #swagger.summary = "Permite a un usuario postularse a un puesto en el Festival del Poncho."
  #swagger.auto = false

  #swagger.requestBody = { required: true, content: {
  "application/json": { schema: { $ref: "#/components/schemas/NuevaPostulacion" } } }
  }

  #swagger.responses[201] = {
    description: "Inscripción creada.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/PostulacionCreada" } } }
  }

  #swagger.responses[401] = {
    description: "Token ausente o inválido.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
    example: { mensaje: "Se requiere un token de acceso." } } }
  }

  #swagger.responses[400] = { description: "Cuerpo inválido o Bearer mal formado." }

  #swagger.responses[403] = { description: "Cuenta inactiva." }

  #swagger.responses[404] = { description: "Evento inexistente." }

  #swagger.responses[409] = { description: "Inscripción duplicada o conflicto de datos." }
*/
  validarBody(postularseSchema), postularse
);

// Reinscripción a una nueva edición para artesanos o administradores con emprendimiento registrado
router.post(
  "/reinscripcion",
  /* 
    #swagger.tags = ['Inscripciones']
    #swagger.summary = "Permite a un usuario autenticado (Artesano o Administrador) con emprendimiento registrado postularse a la edición actual del festival (Reinscripción)."
    #swagger.auto = false
    #swagger.responses[201] = {
      description: "Inscripción para la nueva edición creada con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReinscripcionCreada" } } }
    }
    #swagger.responses[400] = {
      description: "El usuario no posee un emprendimiento registrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ARTESANO o ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Estado inicial 'nuevo' no encontrado en el sistema.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "Ya existe una inscripción registrada para este usuario en la edición actual.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...artesanoOAdmin,
  inscribirseNuevaEdicion
);

// 3. Evaluar trámite (cambiar estado y opcionalmente asignar/liberar stand)
router.patch(
  "/:id/estado",
  /* 
    #swagger.tags = ['Inscripciones']
    #swagger.summary = "Evalúa una postulación cambiando su estado, enviando observaciones y opcionalmente asignando o liberando stand (Solo Administrador)."
    #swagger.auto = false

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de la inscripción en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/CambiarEstadoInscripcion" } } }
    }
    #swagger.responses[200] = {
      description: "Estado de la postulación actualizado correctamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/InscripcionActualizada" } } }
    }
    #swagger.responses[400] = {
      description: "Datos inválidos o el estado indicado no existe.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR o intento de auto-evaluación.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Inscripción no encontrada.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "Conflicto: el estado es el mismo que el actual o el stand seleccionado no está disponible.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(inscripcionIdParamSchema),
  validarBody(cambiarEstadoSchema),
  cambiarEstadoInscripcion
);

export default router;