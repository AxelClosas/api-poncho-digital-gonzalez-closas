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
        const { numero, nombre, estado } = req.body;

        if (typeof numero !== "string" || !numero.trim()) {
            return res.status(400).json({
                mensaje: "El número del stand es obligatorio"
            });
        }

        if (typeof nombre !== "string" || !nombre.trim()) {
            return res.status(400).json({
                mensaje: "El nombre del stand es obligatorio"
            });
        }

        if (estado !== undefined &&
            !["DISPONIBLE", "OCUPADO"].includes(estado)) {
            return res.status(400).json({
                mensaje: "El estado debe ser DISPONIBLE u OCUPADO"
            });
        }

        const nuevoStand = await standService.crearStand({
            numero: numero.trim(),
            nombre: nombre.trim(),
            estado: estado ?? "DISPONIBLE"
        });

        return res.status(201).json(nuevoStand);

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