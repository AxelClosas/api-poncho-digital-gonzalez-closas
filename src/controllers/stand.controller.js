import * as standService from "../services/stand.services.js";

export const obtenerTodos = async (req, res, next) => {
    try {
    const stands = await standService.obtenerStands();

    res.status(200).json(stands);
    } catch (error) {
    next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
    const stand = await standService.obtenerStandPorId(
        req.params.id
);

    if (!stand) {
        return res.status(404).json({
        mensaje: "Stand no encontrado"
        });
    }

    res.status(200).json(stand);
    } catch (error) {
    next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
    const stand = await standService.crearStand(req.body);

    res.status(201).json(stand);
    } catch (error) {
    next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
    const existente = await standService.obtenerStandPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Stand no encontrado"
        });
    }

    const stand = await standService.actualizarStand(
        req.params.id,
        req.body
    );

    res.status(200).json(stand);
    } catch (error) {
    next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
    const existente = await standService.obtenerStandPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Stand no encontrado"
        });
    }

    await standService.eliminarStand(req.params.id);

    res.status(200).json({
        mensaje: "Stand eliminado correctamente"
    });
    } catch (error) {
    next(error);
    }
};