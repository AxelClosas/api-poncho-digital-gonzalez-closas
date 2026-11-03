import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const incluirEmprendimiento = {
  select: {
    id: true,
    nombre: true,
    rubro: { select: { id: true, nombre: true } },
    stand: { select: { id: true, nombre: true, estado: true } },
  },
};

export const crearProducto = async (usuarioId, datos) => {
  // 1. Buscamos el emprendimiento del artesano autenticado
  const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { usuarioId },
  });

  if (!emprendimiento) {
    throw crearError(
      "No posees un emprendimiento registrado para cargar productos.",
      400
    );
  }

  // 2. Creamos el producto asociado
  return prisma.producto.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      precio: datos.precio,
      emprendimientoId: emprendimiento.id,
    },
    include: { emprendimiento: incluirEmprendimiento },
  });
};

export const consultarProductos = async (criterios) => {
  const { busqueda, emprendimientoId, rubroId, ordenPor, direccion, pagina, limite } = criterios;

  const where = {};

  if (emprendimientoId) {
    where.emprendimientoId = emprendimientoId;
  }

  if (rubroId) {
    where.emprendimiento = { rubroId };
  }

  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda, mode: "insensitive" } },
      { descripcion: { contains: busqueda, mode: "insensitive" } },
    ];
  }

  const desplazamiento = (pagina - 1) * limite;

  const [productos, total] = await prisma.$transaction([
    prisma.producto.findMany({
      where,
      orderBy: [{ [ordenPor]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: { emprendimiento: incluirEmprendimiento },
    }),
    prisma.producto.count({ where }),
  ]);

  return {
    productos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerProductoPorId = async (id) => {
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { emprendimiento: incluirEmprendimiento },
  });

  if (!producto) {
    throw crearError(`Producto con ID ${id} no encontrado.`, 404);
  }

  return producto;
};

export const listarMisProductos = async (usuarioId) => {
  const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { usuarioId },
  });

  if (!emprendimiento) {
    return [];
  }

  return prisma.producto.findMany({
    where: { emprendimientoId: emprendimiento.id },
    orderBy: { nombre: "asc" },
  });
};

export const actualizarProducto = async (productoId, usuarioId, datos) => {
  // Comprobamos existencia y pertenencia
  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    include: { emprendimiento : {
      select: { usuarioId: true }
    } },
  });

  if (!producto) {
    throw crearError(`Producto con ID ${productoId} no encontrado.`, 404);
  }

  if (producto.emprendimiento.usuarioId !== usuarioId) {
    throw crearError("No tienes permiso para modificar un producto que no es de tu autoría.", 403);
  }

  return prisma.producto.update({
    where: { id: productoId },
    data: datos,
    include: { emprendimiento: incluirEmprendimiento },
  });
};

export const eliminarProducto = async (productoId, usuarioId) => {
  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    include: { emprendimiento: {
      select: { usuarioId: true }
    } },
  });

  if (!producto) {
    throw crearError(`Producto con ID ${productoId} no encontrado.`, 404);
  }

  if (producto.emprendimiento.usuarioId !== usuarioId) {
    throw crearError("No tienes permiso para eliminar este producto.", 403);
  }

  return prisma.producto.delete({
    where: { id: productoId },
  });
};