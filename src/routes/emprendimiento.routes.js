import { Router } from "express";

import {
  obtenerTodos,
  obtenerPorId,
  actualizar,
  crear,
  eliminar
} from "../controllers/emprendimiento.controller.js";

import {
  consultarEmprendimientosSchema,
  actualizarEmprendimientoSchema,
  emprendimientoIdParamSchema,
  crearEmprendimientoSchema
} from "../validators/emprendimiento.schema.js";

import {
  validarBody,
  validarParametros,
  validarConsulta,
} from "../middlewares/validacion.middleware.js";
import { registrarTendencia } from "../middlewares/tendencias.middleware.js";

import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

import { soloAdmin } from "../middlewares/soloAdmin.js"

const router = Router();

const artesanoOAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO", "ADMINISTRADOR"),
];
// Lectura pública
router.get(
  "/",
  /* 
    #swagger.tags = ['Emprendimientos']
    #swagger.security = [{}]
    #swagger.summary = "Consulta y filtra la lista de emprendimientos con paginación."
    #swagger.auto = false
    #swagger.parameters['busqueda'] = { in: 'query', type: 'string', description: 'Buscar por nombre o descripción' }
    #swagger.parameters['rubroId'] = { in: 'query', type: 'string', format: 'uuid', description: 'Filtrar por rubro' }
    #swagger.parameters['standId'] = { in: 'query', type: 'string', format: 'uuid', description: 'Filtrar por stand asignado' }
    #swagger.parameters['usuarioId'] = { in: 'query', type: 'string', format: 'uuid', description: 'Filtrar por usuario propietario' }
    #swagger.parameters['conStand'] = { in: 'query', type: 'boolean', description: 'Filtrar por existencia de stand asignado' }
    #swagger.parameters['ordenPor'] = { in: 'query', type: 'string', enum: ['id', 'nombre'], default: 'id' }
    #swagger.parameters['direccion'] = { in: 'query', type: 'string', enum: ['asc', 'desc'], default: 'asc' }
    #swagger.parameters['pagina'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limite'] = { in: 'query', type: 'integer', default: 10 }
    #swagger.responses[200] = {
      description: "Listado de emprendimientos obtenido exitosamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ListaEmprendimientosPaginada" } } }
    }
    #swagger.responses[400] = {
      description: "Parámetros de consulta inválidos.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  validarConsulta(consultarEmprendimientosSchema),
  registrarTendencia("EMPRENDIMIENTO"),
  obtenerTodos
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Emprendimientos']
    #swagger.security = [{}]
    #swagger.summary = "Obtiene los detalles de un emprendimiento por su ID."
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del emprendimiento en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[200] = {
      description: "Emprendimiento encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EmprendimientoRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "ID con formato inválido.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Emprendimiento no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  validarParametros(emprendimientoIdParamSchema),
  obtenerPorId
);

// Crear nuevo emprendimiento implica crear un nuevo registro de postulación recuperando los datos
router.post(
  "/",
  /* 
    #swagger.tags = ['Emprendimientos']
    #swagger.summary = "Crea un nuevo emprendimiento y registra la postulación a la edición actual (Artesano o Administrador)."
    #swagger.auto = false
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/CrearEmprendimiento" } } }
    }
    #swagger.responses[201] = {
      description: "Emprendimiento y postulación creados con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EmprendimientoCreado" } } }
    }
    #swagger.responses[400] = {
      description: "Datos inválidos, usuario ya posee un emprendimiento registrado o ya tiene inscripción en la edición actual.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ARTESANO o ADMINISTRADOR, o cuenta inactiva.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Rubro indicado inexistente o estado inicial 'nuevo' no configurado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...artesanoOAdmin,
  validarBody(crearEmprendimientoSchema),
  crear
);

// Actualización del propietario o de un administrador
router.patch(
  "/:id",
  /* 
    #swagger.tags = ['Emprendimientos']
    #swagger.summary = "Actualiza los datos de un emprendimiento (Propietario o Administrador). Si la postulación está en 'solicitud_cambio', transiciona a 'actualizado'."
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del emprendimiento en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarEmprendimiento" } } }
    }
    #swagger.responses[200] = {
      description: "Emprendimiento actualizado exitosamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/EmprendimientoRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "Cuerpo vacío o sin campos válidos para actualizar, o rubro inexistente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: solo el propietario del emprendimiento o un ADMINISTRADOR pueden modificarlo.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Emprendimiento no encontrado o estado 'actualizado' no configurado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...artesanoOAdmin,
  validarParametros(emprendimientoIdParamSchema),
  validarBody(actualizarEmprendimientoSchema),
  actualizar
);

// Eliminacion Administrativa
// router.delete("/:id",...soloAdmin(),validarParametros(emprendimientoIdParamSchema), eliminar);

export default router;
