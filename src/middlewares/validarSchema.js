export const validarSchema = (schema) => {
    return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.issues
        });
    }

    req.body = resultado.data;

    next();
    };
};