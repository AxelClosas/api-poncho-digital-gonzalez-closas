import prisma from "../config/prisma.js";

export const obtenerEmprendimientos = async () => {
    return await prisma.emprendimiento.findMany();
};

export const obtenerEmprendimientoPorId = async (id) => {
    return await prisma.emprendimiento.findUnique({
        where: {
            id: Number(id)
        }
    });
};

export const crearEmprendimiento = async (datos) => {
    return await prisma.emprendimiento.create({
        data: {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            localidad: datos.localidad
        }
    });
};

export const actualizarEmprendimiento = async (id, datos) => {
    return await prisma.emprendimiento.update({
        where: {
            id: Number(id)
        },
        data: {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            localidad: datos.localidad
        }
    });
};

export const eliminarEmprendimiento = async (id) => {
    return await prisma.emprendimiento.delete({
        where: {
            id: Number(id)
        }
    });
};