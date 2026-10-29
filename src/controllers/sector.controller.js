import * as sectorService from "../services/sector.services.js";

export const obtenerTodos = async (req, res, next) => {
  try {
    const sectores = await sectorService.obtenerSectores(req.consultaValidada);
    return res.status(200).json(sectores);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const sector = await sectorService.obtenerSectorPorId(
      req.parametrosValidados.id
    );
    return res.status(200).json(sector);
  } catch (error) {
    return next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const nuevoSector = await sectorService.crearSector(req.bodyValidado);
    return res.status(201).json(nuevoSector);
  } catch (error) {
    return next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const sectorActualizado = await sectorService.actualizarSector(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(sectorActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await sectorService.eliminarSector(req.parametrosValidados.id);
    return res.status(200).json({
      mensaje: "Sector eliminado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
};