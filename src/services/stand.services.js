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
        numero: datos.numero,
        ...(datos.estado !== undefined && {
        estado: datos.estado
        })
    }
    });
};

export const actualizarStand = async (id, datos) => {
    return await prisma.stand.update({
    where: {
        id: Number(id)
    },
    data: {
        numero: datos.numero,
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