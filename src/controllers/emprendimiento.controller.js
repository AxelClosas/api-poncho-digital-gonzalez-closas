import * as emprendimientoService from "../services/emprendimiento.services.js";

export const obtenerTodos = async (req, res, next) => {
    try {
        const emprendimientos =
            await emprendimientoService.obtenerEmprendimientos(req.consultaValidada);

        return res.status(200).json(emprendimientos);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {

        const { id } = req.parametrosValidados;

        const emprendimiento =
            await emprendimientoService.obtenerEmprendimientoPorId(id);

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

/*export const crear = async (req, res, next) => {
    try {

        const emprendimiento =
            await emprendimientoService.crearEmprendimiento(req.bodyValidado);

        return res.status(201).json(emprendimiento);
    } catch (error) {
        next(error);
    }
};*/

export const actualizar = async (req, res, next) => {
    try {

        const emprendimiento =
        await emprendimientoService.actualizarEmprendimiento(
            req.parametrosValidados.id,
            req.bodyValidado,
            req.contextoUsuario
    );

        return res.status(200).json(emprendimiento);
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {

        await emprendimientoService.eliminarEmprendimiento(req.parametrosValidados.id);

        return res.status(200).json({
            mensaje: "Emprendimiento eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
};
