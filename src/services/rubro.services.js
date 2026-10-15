import prisma from "../config/prisma.js";

export const obtenerRubros = async () => {
    return await prisma.rubro.findMany();
};

export const obtenerRubroPorId = async (id) => {
    return await prisma.rubro.findUnique({
        where: {
            id: Number(id)
        }
    });
};

export const crearRubro = async (datos) => {
    return await prisma.rubro.create({
        data: {
            nombre: datos.nombre,
            descripcion: datos.descripcion
        }
    });
};

export const actualizarRubro = async (id, datos) => {
    return await prisma.rubro.update({
        where: {
            id: Number(id)
        },
        data: {
            nombre: datos.nombre,
            descripcion: datos.descripcion
        }
    });
};

export const eliminarRubro = async (id) => {
    return await prisma.rubro.delete({
        where: {
            id: Number(id)
        }
    });
};