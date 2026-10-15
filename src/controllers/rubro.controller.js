import * as rubroService from "../services/rubro.services.js";

export const obtenerTodos = async (req, res, next) => {
    try {
        const rubros = await rubroService.obtenerRubros();

        return res.status(200).json(rubros);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const rubro = await rubroService.obtenerRubroPorId(req.params.id);

        if (!rubro) {
            return res.status(404).json({
                error: "Rubro no encontrado"
            });
        }

        return res.status(200).json(rubro);
    } catch (error) {
        next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
        const rubro = await rubroService.crearRubro(req.body);

        return res.status(201).json(rubro);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const existente = await rubroService.obtenerRubroPorId(req.params.id);

        if (!existente) {
            return res.status(404).json({
                error: "Rubro no encontrado"
            });
        }

        const rubro = await rubroService.actualizarRubro(
            req.params.id,
            req.body
        );

        return res.status(200).json(rubro);
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const existente = await rubroService.obtenerRubroPorId(req.params.id);

        if (!existente) {
            return res.status(404).json({
                error: "Rubro no encontrado"
            });
        }

        await rubroService.eliminarRubro(req.params.id);

        return res.status(200).json({
            mensaje: "Rubro eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
};