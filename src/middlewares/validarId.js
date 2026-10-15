export const validarId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
        mensaje: "El ID debe ser un número entero positivo"
    });
    }

    next();
};