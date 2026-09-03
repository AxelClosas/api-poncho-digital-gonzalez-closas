let postulaciones = [];
let siguientesId = 1;

export const crearPostulacion = (dato) => {
    const nuevaPostulacion = {
        id: siguientesId++,
        ...dato,
        estado: "PENDIENTE"
    };

    postulaciones.push(nuevaPostulacion);
    return nuevaPostulacion;
}   

export const obtenerPostulaciones = () => {
    return postulaciones;
}

export const obtenerPostulacionPorId = (id) => {
    return postulaciones.find(
        postulacion => postulacion.id == Number(id)
    );

    if (indice === -1) {
        return null;
    }

    postulaciones[indice] = {
        ...postulaciones[indice],
        ...dato
    };  

    return postulaciones[indice];
}

export const elimanrPostulacion = (id) => {
    const indice = postulaciones.findIndex(
        postulacion => postulacion.id == Number(id)
    );

    if (indice === -1) {
        return false;
    }

    postulaciones.splice(indice, 1);
    return true;
}  


