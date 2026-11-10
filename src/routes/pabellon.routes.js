import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/pabellon.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
  validarConsulta

} from "../middlewares/validacion.middleware.js";
import {
  crearPabellonSchema,
  actualizarPabellonSchema,
  pabellonIdParamSchema,
  consultarPabellonesSchema
} from "../validators/pabellon.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get(
  "/",
  /* 
    #swagger.security = [{}]
    #swagger.tags = ['Pabellones']
    #swagger.summary = "Consulta de pabellones con filtros y paginación (Pública)."

    #swagger.parameters['nombre'] = {
      in: 'query',
      description: 'Filtrar pabellones por nombre (búsqueda parcial insensible a mayúsculas)',
      type: 'string',
      required: false
    }
    #swagger.parameters['ordenPor'] = {
      in: 'query',
      description: 'Campo por el cual ordenar los resultados',
      type: 'string',
      schema: { '@enum': ['nombre'] },
      default: 'nombre',
      required: false
    }
    #swagger.parameters['direccion'] = {
      in: 'query',
      description: 'Dirección de ordenamiento',
      type: 'string',
      schema: { '@enum': ['asc', 'desc'] },
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
      description: "Lista paginada de pabellones obtenida con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ListaPabellonesPaginada" } } }
    }
    #swagger.responses[400] = {
      description: "Parámetros de consulta inválidos.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  validarConsulta(consultarPabellonesSchema),
  obtenerTodos
);

router.get(
  "/:id",
  /* 
    #swagger.security = [{}]
    #swagger.tags = ['Pabellones']
    #swagger.summary = "Obtiene los detalles de un pabellón por su ID (Pública)."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del pabellón en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[200] = {
      description: "Detalle del pabellón obtenido con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/PabellonDetalle" } } }
    }
    #swagger.responses[400] = {
      description: "ID de pabellón inválido (debe ser un UUID válido).",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[404] = {
      description: "Pabellón no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  validarParametros(pabellonIdParamSchema),
  obtenerPorId
);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  /* 
    #swagger.tags = ['Pabellones']
    #swagger.summary = "Crea un nuevo pabellón (Solo Administrador)."
    #swagger.auto = false

    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/CrearPabellon" } } }
    }
    #swagger.responses[201] = {
      description: "Pabellón creado con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/PabellonRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "Datos del cuerpo de la petición inválidos.",
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
  */
  ...soloAdmin(),
  validarBody(crearPabellonSchema),
  crear
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Pabellones']
    #swagger.summary = "Actualiza los datos de un pabellón existente (Solo Administrador)."
    #swagger.auto = false

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del pabellón en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarPabellon" } } }
    }
    #swagger.responses[200] = {
      description: "Pabellón actualizado con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/PabellonRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "ID o datos del cuerpo de la petición inválidos.",
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
      description: "Pabellón no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(pabellonIdParamSchema),
  validarBody(actualizarPabellonSchema),
  actualizar
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Pabellones']
    #swagger.summary = "Elimina un pabellón existente (Solo Administrador)."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del pabellón en formato UUID',
      required: true,
      type: 'string',
      format: 'uuid'
    }
    #swagger.responses[200] = {
      description: "Pabellón eliminado correctamente.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/MensajeRespuesta" } } }
    }
    #swagger.responses[400] = {
      description: "ID de pabellón inválido (debe ser un UUID válido).",
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
      description: "Pabellón no encontrado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[409] = {
      description: "Conflicto: No se puede eliminar el pabellón porque contiene sectores asociados.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  validarParametros(pabellonIdParamSchema),
  eliminar
);

export default router;