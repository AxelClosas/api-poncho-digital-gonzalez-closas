import express from "express";

import {
  crear,
  obtenerTodas,
  obtenerPorId,
  actualizar,
  eliminar
} from "../controllers/postulaciones.controller.js";

const router = express.Router();

router.post("/", crear);
router.get("/", obtenerTodas);
router.get("/:id", obtenerPorId);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;