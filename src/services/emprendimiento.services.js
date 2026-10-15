import prisma from "../config/prisma.js";

import { crearError } from "../utils/errores.js";

const seleccionEmprendimiento = {
    id: true,
    nombre: true,
    descripcion: true,
    rubroId: true,
    standId: true,
    rubro: {
    select: {
        id: true,
        nombre: true,
    },
    },
    stand: {
    select: {
        id: true,
        nombre: true,
        estado: true,
    },
    },
};

const validarRubro = async (cliente, rubroId) => {
  // Omitido: conservar el valor actual.
  // Null: quitar la asociación.
    if (rubroId === undefined || rubroId === null) {
    return;
    }

    const rubro = await cliente.rubro.findUnique({
    where: { id: rubroId },
    select: { id: true },
    });

    if (!rubro) {
    throw crearError("El rubro indicado no existe.", 400);
    }
};

export const obtenerEmprendimientos = async (criterios) => {
    const { busqueda, rubroId, standId, usuarioId, conStand,
        ordenPor, direccion, pagina, limite } = criterios;
    const where = {};
    if (rubroId !== undefined) where.rubroId = rubroId;
    if (usuarioId !== undefined) where.usuarioId = usuarioId;
    if (standId !== undefined) where.standId = standId;
    else if (conStand !== undefined) where.standId = conStand ? { not: null } : null;
    if (busqueda) {
        where.OR = [
            { nombre: { contains: busqueda, mode: "insensitive" } },
            { descripcion: { contains: busqueda, mode: "insensitive" } },
        ];
    }
    const orderBy = ordenPor === "id"
        ? [{ id: direccion }]
        : [{ [ordenPor]: direccion }, { id: "asc" }];
    const [emprendimientos, total] = await prisma.$transaction([
        prisma.emprendimiento.findMany({
            where,
            select: seleccionEmprendimiento,
            orderBy,
            skip: (pagina - 1) * limite,
            take: limite,
        }),
        prisma.emprendimiento.count({ where }),
    ], { isolationLevel: "RepeatableRead" });
    return {
        emprendimientos,
        paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
};

export const obtenerEmprendimientoPorId = async (id) => {
    const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { id },
    select: seleccionEmprendimiento,
    });
    if (!emprendimiento) {
    throw crearError("Emprendimiento no encontrado.", 404);
    }

    return emprendimiento;
};

 /*export const crearEmprendimiento = async (datos) => {
    return await prisma.emprendimiento.create({
        data: {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            localidad: datos.localidad
        }
    });
};*/

export const actualizarEmprendimiento = async (
    id,
    datos,
    usuarioActual
) => {
    const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { id },
    });

    if (!emprendimiento) {
    throw crearError("Emprendimiento no encontrado.", 404);
    }

    const esAdmin = usuarioActual.roles.includes("ADMINISTRADOR");
    const esPropietario = emprendimiento.usuarioId === usuarioActual.id;

    if (!esAdmin && !esPropietario) {
    throw crearError(
        "No tenés permiso para modificar este emprendimiento.",
        403
    );
    }

    return prisma.emprendimiento.update({
    where: { id },
    data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
    },
    });
};

export const eliminarEmprendimiento = async (id) => {
    return await prisma.emprendimiento.delete({
        where: {
            id: Number(id)
        }
    });
};
