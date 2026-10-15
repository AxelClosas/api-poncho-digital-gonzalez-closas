import { Router } from "express";

import {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} from "../controllers/rubro.controllers.js";

import {
    crearRubroSchema,
    actualizarRubroSchema
} from "../schema/rubro.schema.js";

import { validarSchema } from "../middlewares/validarSchema.js";
import { validarId } from "../middlewares/validarId.js";

const router = Router();

router.get("/", obtenerTodos);

router.get("/:id", validarId, obtenerPorId);

router.post(
    "/",
    validarSchema(crearRubroSchema),
    crear
);

router.put(
    "/:id",
    validarId,
    validarSchema(actualizarRubroSchema),
    actualizar
);

router.delete("/:id", validarId, eliminar);

export default router;