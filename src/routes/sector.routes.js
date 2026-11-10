import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/sector.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
  validarConsulta
} from "../middlewares/validacion.middleware.js";
import {
  crearSectorSchema,
  actualizarSectorSchema,
  sectorIdParamSchema,
  consultarSectoresSchema
} from "../validators/sector.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get("/", /*
    #swagger.auto = false
    #swagger.tags = ['Sectores']
    #swagger.security = [{}]
    #swagger.summary = "Consulta sectores con filtros y paginación."

    #swagger.parameters['nombre'] = {
      in: 'query',
      description: 'Búsqueda parcial por nombre, sin distinguir mayúsculas.',
      required: false,
      '@schema': { type: 'string', minLength: 1 }
    }

    #swagger.parameters['ordenPor'] = {
      in: 'query',
      required: false,
      '@schema': {
        type: 'string',
        enum: ['nombre'],
        default: 'nombre'
      }
    }

    #swagger.parameters['direccion'] = {
      in: 'query',
      required: false,
      '@schema': {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'asc'
      }
    }

    #swagger.parameters['pagina'] = {
      in: 'query',
      required: false,
      '@schema': { type: 'integer', minimum: 1, default: 1 }
    }

    #swagger.parameters['limite'] = {
      in: 'query',
      required: false,
      '@schema': {
        type: 'integer',
        minimum: 1,
        maximum: 50,
        default: 10
      }
    }

    #swagger.responses[200] = {
      description: 'Listado paginado de sectores.',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ListaSectoresPaginada'
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Parámetros de consulta inválidos.'
    }
  */ validarConsulta(consultarSectoresSchema), obtenerTodos);
router.get("/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Sectores']
    #swagger.security = [{}]
    #swagger.summary = "Obtiene un sector con su pabellón y sus stands."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.responses[200] = {
      description: 'Detalle del sector.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/SectorDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'UUID inválido.'
    }

    #swagger.responses[404] = {
      description: 'Sector no encontrado.'
    }
  */ validarParametros(sectorIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  /*
    #swagger.auto = false
    #swagger.tags = ['Sectores']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Crea un sector. Requiere rol ADMINISTRADOR."

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/CrearSector' }
        }
      }
    }

    #swagger.responses[201] = {
      description: 'Sector creado con su pabellón.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/SectorRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Datos inválidos, pabellón inexistente o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }
  */
  ...soloAdmin(),
  validarBody(crearSectorSchema),
  crear
);

router.put(
  "/:id",
  /*
    #swagger.auto = false
    #swagger.tags = ['Sectores']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Actualiza un sector. Requiere rol ADMINISTRADOR."
    #swagger.description = "Todos los campos del cuerpo son opcionales."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ActualizarSector' }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Sector actualizado con su pabellón.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/SectorRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Datos o UUID inválidos, pabellón inexistente o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Sector no encontrado.'
    }
  */
  ...soloAdmin(),
  validarParametros(sectorIdParamSchema),
  validarBody(actualizarSectorSchema),
  actualizar
);

router.delete(
  "/:id",
  /*
    #swagger.auto = false
    #swagger.tags = ['Sectores']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Elimina un sector. Requiere rol ADMINISTRADOR."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.responses[200] = {
      description: 'Sector eliminado.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/MensajeRespuesta' }
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
      description: 'Sector no encontrado.'
    }

    #swagger.responses[409] = {
      description: 'El sector contiene stands asociados.'
    }
  */
  ...soloAdmin(),
  validarParametros(sectorIdParamSchema),
  eliminar
);

export default router;