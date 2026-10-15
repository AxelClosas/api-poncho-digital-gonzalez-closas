import * as pabellonService from "../services/pabellon.service.js";

export const obtenerTodos = async (req, res, next) => {
    try {
    const pabellones = await pabellonService.obtenerPabellones();

    res.status(200).json(pabellones);
    } catch (error) {
    next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
    const pabellon = await pabellonService.obtenerPabellonPorId(
        req.params.id
    );

    if (!pabellon) {
        return res.status(404).json({
        mensaje: "Pabellón no encontrado"
        });
    }

    res.status(200).json(pabellon);
    } catch (error) {
    next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
    const pabellon = await pabellonService.crearPabellon(
        req.body
    );

    res.status(201).json(pabellon);
    } catch (error) {
    next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
    const existente = await pabellonService.obtenerPabellonPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Pabellón no encontrado"
        });
    }

    const pabellon = await pabellonService.actualizarPabellon(
        req.params.id,
        req.body
    );

    res.status(200).json(pabellon);
    } catch (error) {
    next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
    const existente = await pabellonService.obtenerPabellonPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Pabellón no encontrado"
        });
    }

    await pabellonService.eliminarPabellon(req.params.id);

    res.status(200).json({
        mensaje: "Pabellón eliminado correctamente"
    });
    } catch (error) {
    next(error);
    }
};
