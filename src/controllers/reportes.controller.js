import * as reportesService from "../services/reportes.service.js";

export const reporteArtesanos = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteArtesanos();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const reporteArtesanosPorLocalidad = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteArtesanosPorLocalidad();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const reporteArtesanosPorRubro = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteArtesanosPorRubro();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const reporteOcupacionStands = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteOcupacionStands();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const reporteProductosPorArtesano = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteProductosPorArtesano();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const reporteTendenciasBusqueda = async (req, res, next) => {
  try {
    const data = await reportesService.obtenerReporteTendenciasBusqueda(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

