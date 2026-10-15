import prisma from "../config/prisma.js";

export const obtenerSectores = async () => {
    return await prisma.sector.findMany();
};

export const obtenerSectorPorId = async (id) => {
    return await prisma.sector.findUnique({
    where: {
        id: Number(id)
    }
    });
};

export const crearSector = async (datos) => {
    return await prisma.sector.create({
    data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    }
    });
};

export const actualizarSector = async (id, datos) => {
    return await prisma.sector.update({
    where: {
        id: Number(id)
    },
    data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    }
    });
};

export const eliminarSector = async (id) => {
    return await prisma.sector.delete({
    where: {
        id: Number(id)
    }
    });
};

