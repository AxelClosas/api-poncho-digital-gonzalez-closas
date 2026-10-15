import { Router } from "express";

import {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} from "../controllers/emprendimiento.controller.js";

import {
    crearEmprendimientoSchema,
    actualizarEmprendimientoSchema
} from "../validators/emprendimiento.schema.js";

import { validarSchema } from "../middlewares/validarSchema.js";
import { validarId } from "../middlewares/validarId.js";

const router = Router();

router.get("/", obtenerTodos);

router.get("/:id", validarId, obtenerPorId);

router.post(
    "/",
    validarSchema(crearEmprendimientoSchema),
    crear
);

router.put(
    "/:id",
    validarId,
    validarSchema(actualizarEmprendimientoSchema),
    actualizar
);

router.delete("/:id", validarId, eliminar);

export default router;