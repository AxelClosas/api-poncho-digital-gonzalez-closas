import * as sectorService from "../services/sector.services.js";

export const obtenerTodos = async (req, res, next) => {
    try {
        const sectores = await sectorService.obtenerSectores();
        res.status(200).json(sectores);
    } catch (error) {
        next(error);
    }  
};

export const obtenerPorId = async (req, res, next) => {
    try {
    const sector = await sectorService.obtenerSectorPorId(
        req.params.id
    );

    if (!sector) {
        return res.status(404).json({
        mensaje: "Sector no encontrado"
        });
    }

    res.status(200).json(sector);
    } catch (error) {
    next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
    const sector = await sectorService.crearSector(req.body);

    res.status(201).json(sector);
    } catch (error) {
    next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
    const existente = await sectorService.obtenerSectorPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Sector no encontrado"
        });
    }

    const sector = await sectorService.actualizarSector(
        req.params.id,
        req.body
    );

    res.status(200).json(sector);
    } catch (error) {
    next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
    const existente = await sectorService.obtenerSectorPorId(
        req.params.id
    );

    if (!existente) {
        return res.status(404).json({
        mensaje: "Sector no encontrado"
        });
    }

    await sectorService.eliminarSector(req.params.id);

    res.status(200).json({
        mensaje: "Sector eliminado correctamente"
    });
    } catch (error) {
    next(error);
    }
};