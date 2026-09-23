import {
    crearPostulacion,
    obtenerPostulaciones,
    obtenerPostulacionPorId,
    actualizarPostulacion,
    eliminarPostulacion
} from "../services/postulaciones.service.js";

// POST /api/postulaciones
export const crear = (req, res) => {
    const postulacion = crearPostulacion(req.body);

    res.status(201).json({
        mensaje: "Postulación creada correctamente",
        postulacion
    });
};

// GET /api/postulaciones
export const obtenerTodas = (req, res) => {
    const postulaciones = obtenerPostulaciones();

    res.status(200).json(postulaciones);
};

// GET /api/postulaciones/:id
export const obtenerPorId = (req, res) => {
    const postulacion = obtenerPostulacionPorId(req.params.id);

    if (!postulacion) {
        return res.status(404).json({
            mensaje: "Postulación no encontrada"
        });
    }

    res.status(200).json(postulacion);
};

// PUT /api/postulaciones/:id
export const actualizar = (req, res) => {
    const postulacion = actualizarPostulacion(
        req.params.id,
        req.body
    );

    if (!postulacion) {
        return res.status(404).json({
            mensaje: "Postulación no encontrada"
        });
    }

    res.status(200).json({
        mensaje: "Postulación actualizada correctamente",
        postulacion
    });
};

// DELETE /api/postulaciones/:id
export const eliminar = (req, res) => {
    const eliminada = eliminarPostulacion(req.params.id);

    if (!eliminada) {
        return res.status(404).json({
            mensaje: "Postulación no encontrada"
        });
    }

    res.status(204).send();
};