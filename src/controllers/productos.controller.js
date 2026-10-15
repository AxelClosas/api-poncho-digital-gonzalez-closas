import * as productosService from "../services/productos.service.js";

export const crearProducto = async (req, res, next) => {
  try {
    const nuevoProducto = await productosService.crearProducto(
      req.usuario.id,
      req.bodyValidado
    );
    return res.status(201).json(nuevoProducto);
  } catch (error) {
    return next(error);
  }
};

export const consultarProductos = async (req, res, next) => {
  try {
    const resultado = await productosService.consultarProductos(req.consultaValidada);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await productosService.obtenerProductoPorId(
      req.parametrosValidados.id
    );
    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

export const listarMisProductos = async (req, res, next) => {
  try {
    const productos = await productosService.listarMisProductos(req.usuario.id);
    return res.status(200).json(productos);
  } catch (error) {
    return next(error);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const productoActualizado = await productosService.actualizarProducto(
      req.parametrosValidados.id,
      req.usuario.id,
      req.bodyValidado
    );
    return res.status(200).json(productoActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    await productosService.eliminarProducto(
      req.parametrosValidados.id,
      req.usuario.id
    );
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};