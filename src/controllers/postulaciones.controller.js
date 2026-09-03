import {
    crearPostulacion,
    obtenerPostulaciones,
    obtenerPostulacionPorId,
    actualizarPostulacion,
    elimanrPostulacion
}from "../services/postulaciones.service.js";

export const crear = (req, res) => {
    const postulacion = crearPostulacion(req.body);

    res.status(201).json({
        mensaje: "Postulacion creada correctamente",
        postulacion
    });
}

export const obtenerTodas = (req, res) => {
    const postulaciones = obtenerPostulaciones();
    res.status(200).json(postulaciones);
};

export const actualizar = (req, res) => {

    const postulacion = actualizarPostulacion(
        req.params.id,
        req.body);
    
        if (!postulacion) {
            return res.status(404).json({
                mensaje: "Postulacion no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Postulacion actualizada correctamente",
            postulacion
        });
}

    export const eliminar = (req, res) =>{
        const eliminada = eliminarPostulacion(req.params.id);

        if (!eliminada){
            return res.status(404).json({
                mensaje: "Postulacion no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Postulacion eliminada correctamente"
        });
    }

    res.status(204).send();