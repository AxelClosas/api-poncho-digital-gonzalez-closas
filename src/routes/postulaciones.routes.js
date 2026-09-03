import express from "express";

const router = express.Router();

router.get("/api/postulaciones", (req, res) => {
    res.json({
        mensaje: "Postulaciones funcionando"
    });
});

export default router;