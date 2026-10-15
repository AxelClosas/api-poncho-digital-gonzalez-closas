import * as emprendimientoService from "../services/emprendimiento.services.js";

export const obtenerTodos = async (req, res, next) => {
    try {
        const emprendimientos =
            await emprendimientoService.obtenerEmprendimientos();

        return res.status(200).json(emprendimientos);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const emprendimiento =
            await emprendimientoService.obtenerEmprendimientoPorId(req.params.id);

        if (!emprendimiento) {
            return res.status(404).json({
                error: "Emprendimiento no encontrado"
            });
        }

        return res.status(200).json(emprendimiento);
    } catch (error) {
        next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
        const emprendimiento =
            await emprendimientoService.crearEmprendimiento(req.body);

        return res.status(201).json(emprendimiento);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const existente =
            await emprendimientoService.obtenerEmprendimientoPorId(req.params.id);

        if (!existente) {
            return res.status(404).json({
                error: "Emprendimiento no encontrado"
            });
        }

        const emprendimiento =
            await emprendimientoService.actualizarEmprendimiento(
                req.params.id,
                req.body
            );

        return res.status(200).json(emprendimiento);
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const existente =
            await emprendimientoService.obtenerEmprendimientoPorId(req.params.id);

        if (!existente) {
            return res.status(404).json({
                error: "Emprendimiento no encontrado"
            });
        }

        await emprendimientoService.eliminarEmprendimiento(req.params.id);

        return res.status(200).json({
            mensaje: "Emprendimiento eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
};