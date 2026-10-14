
import prisma from "../config/prisma.js";

export const obtenerPabellones = async () => {
    return await prisma.pabellon.findMany();
};

export const obtenerPabellonPorId = async (id) => {
    return await prisma.pabellon.findUnique({
    where: {
        id: Number(id)
    }
    });
};

export const crearPabellon = async (datos) => {
    return await prisma.pabellon.create({
    data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    }
    });
};

export const actualizarPabellon = async (id, datos) => {
    return await prisma.pabellon.update({
    where: {
        id: Number(id)
    },
    data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    }
    });
};

export const eliminarPabellon = async (id) => {
    return await prisma.pabellon.delete({
    where: {
        id: Number(id)
    }
    });
};

