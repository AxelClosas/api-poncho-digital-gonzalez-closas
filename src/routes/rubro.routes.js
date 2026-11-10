import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/rubro.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearRubroSchema,
  actualizarRubroSchema,
  rubroIdParamSchema,
} from "../validators/rubro.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get("/", /*
    #swagger.tags = ["rubros"]
    #swagger.summary = "Lista todos los rubros (público)."
    #swagger.description = "Devuelve un arreglo sin paginación, ordenado por ID ascendente."
    #swagger.security = [{}]

    #swagger.responses[200] = {
      description: "Listado de rubros.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ListaRubros" }
        }
      }
    }
  */ obtenerTodos);
router.get("/:id", /*
    #swagger.tags = ["rubros"]
    #swagger.summary = "Obtiene un rubro por ID (público)."
    #swagger.description = "Incluye el ID y el nombre de los emprendimientos asociados."
    #swagger.security = [{}]

    #swagger.parameters["id"] = {
      in: "path",
      required: true,
      description: "UUID del rubro.",
      schema: { type: "string", format: "uuid" }
    }

    #swagger.responses[200] = {
      description: "Rubro encontrado con sus emprendimientos asociados.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/RubroDetalle" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "El ID no es un UUID válido."
    }
    #swagger.responses[404] = {
      description: "Rubro inexistente."
    }
  */ validarParametros(rubroIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",/*
    #swagger.tags = ["rubros"]
    #swagger.summary = "Crea un rubro (solo ADMINISTRADOR)."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.auto = false

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CrearRubro" }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Rubro creado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/RubroRespuesta" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Cuerpo inválido o encabezado Authorization mal formado."
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido, vencido o revocado."
    }
    #swagger.responses[403] = {
      description: "Cuenta inhabilitada o sin rol ADMINISTRADOR."
    }
    #swagger.responses[409] = {
      description: "Ya existe un rubro con ese nombre o hay un conflicto de datos."
    }
  */
  ...soloAdmin(),
  validarBody(crearRubroSchema),
  crear
);

router.put(
  "/:id",/*
    #swagger.tags = ["rubros"]
    #swagger.summary = "Actualiza un rubro (solo ADMINISTRADOR)."
    #swagger.description = "Permite actualizar nombre y/o descripción. Los campos omitidos conservan su valor. La descripción admite null."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.auto = false

    #swagger.parameters["id"] = {
      in: "path",
      required: true,
      description: "UUID del rubro.",
      schema: { type: "string", format: "uuid" }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ActualizarRubro" }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Rubro actualizado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/RubroRespuesta" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "UUID, cuerpo o encabezado Authorization inválidos."
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido, vencido o revocado."
    }
    #swagger.responses[403] = {
      description: "Cuenta inhabilitada o sin rol ADMINISTRADOR."
    }
    #swagger.responses[404] = {
      description: "Rubro inexistente."
    }
    #swagger.responses[409] = {
      description: "Ya existe otro rubro con ese nombre o hay un conflicto de datos."
    }
  */
  ...soloAdmin(),
  validarParametros(rubroIdParamSchema),
  validarBody(actualizarRubroSchema),
  actualizar
);

router.delete(
  "/:id",/*
    #swagger.tags = ["rubros"]
    #swagger.summary = "Elimina un rubro (solo ADMINISTRADOR)."
    #swagger.description = "No permite eliminar rubros con emprendimientos asociados."
    #swagger.security = [{ bearerAuth: [] }]

    #swagger.parameters["id"] = {
      in: "path",
      required: true,
      description: "UUID del rubro.",
      schema: { type: "string", format: "uuid" }
    }

    #swagger.responses[200] = {
      description: "Rubro eliminado.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/MensajeRespuesta" },
          example: {
            mensaje: "Rubro eliminado correctamente."
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "UUID inválido o encabezado Authorization mal formado."
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido, vencido o revocado."
    }
    #swagger.responses[403] = {
      description: "Cuenta inhabilitada o sin rol ADMINISTRADOR."
    }
    #swagger.responses[404] = {
      description: "Rubro inexistente."
    }
    #swagger.responses[409] = {
      description: "El rubro tiene emprendimientos asociados o hay un conflicto de datos."
    }
  */
  ...soloAdmin(),
  validarParametros(rubroIdParamSchema),
  eliminar
);

export default router;