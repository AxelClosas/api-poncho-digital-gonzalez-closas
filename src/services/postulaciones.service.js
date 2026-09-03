let postulaciones = [];

let siguienteId = 1;


// Crear una postulación
export const crearPostulacion = (datos) => {

    const nuevaPostulacion = {
        id: siguienteId++,
        ...datos,
        estado: "PENDIENTE"
    };

    postulaciones.push(nuevaPostulacion);

    return nuevaPostulacion;
};


// Obtener todas las postulaciones
export const obtenerPostulaciones = () => {

    return postulaciones;
};


// Obtener una postulación por ID
export const obtenerPostulacionPorId = (id) => {

    return postulaciones.find(
        postulacion => postulacion.id === Number(id)
    );
};


// Actualizar una postulación
export const actualizarPostulacion = (id, datos) => {

    const indice = postulaciones.findIndex(
        postulacion => postulacion.id === Number(id)
    );

    if (indice === -1) {
        return null;
    }

    postulaciones[indice] = {
        ...postulaciones[indice],
        ...datos
    };

    return postulaciones[indice];
};


// Eliminar una postulación
export const eliminarPostulacion = (id) => {

    const indice = postulaciones.findIndex(
        postulacion => postulacion.id === Number(id)
    );

    if (indice === -1) {
        return false;
    }

    postulaciones.splice(indice, 1);

    return true;
};

