import express from "express";

import {
    crear,
    obtenerTodas,
    obtenerPorId,
    actualizar,
    eliminar
} from "../controllers/postulaciones.controller.js";

const router = express.Router();

router.post("/api/postulaciones", crear);
router.get("/api/postulaciones", obtenerTodas);
router.get("/api/postulaciones/:id", obtenerPorId);
router.put("/api/postulaciones/:id", actualizar);
router.delete("/api/postulaciones/:id", eliminar);

export default router;