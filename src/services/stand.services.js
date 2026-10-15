import prisma from "../config/prisma.js";

export const obtenerStands = async () => {
    return await prisma.stand.findMany();
};

export const obtenerStandPorId = async (id) => {
    return await prisma.stand.findUnique({
    where: {
        id: Number(id)
    }
    });
};

export const crearStand = async (datos) => {
    return await prisma.stand.create({
        data: {
            nombre: datos.nombre,
            estado: datos.estado
        }
    });
};

export const actualizarStand = async (id, datos) => {
    return await prisma.stand.update({
        where: {
            id: Number(id)
        },
        data: {
            nombre: datos.nombre,
            estado: datos.estado
        }
    });
};

export const eliminarStand = async (id) => {
    return await prisma.stand.delete({
    where: {
        id: Number(id)
    }
    });
};