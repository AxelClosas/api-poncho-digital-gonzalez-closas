import prisma from "../config/prisma.js";

/**
 * Middleware para registrar en segundo plano los términos de búsqueda
 * ingresados por los visitantes, alimentando las estadísticas de tendencias.
 *
 * No interrumpe ni bloquea la respuesta al cliente.
 *
 * @param {string} entidad Identificador de catálogo ("PRODUCTO", "EMPRENDIMIENTO", etc.)
 */
export const registrarTendencia = (entidad = "PRODUCTO") => (req, res, next) => {
  // 1. Permitimos que el flujo de la petición continúe inmediatamente
  next();

  // 2. Extraemos el término de búsqueda de los parámetros validados o query
  const termino = (
    req.consultaValidada?.busqueda ||
    req.query?.busqueda ||
    ""
  ).trim();

  // 3. Si el término tiene al menos 2 caracteres significativos, lo guardamos en segundo plano
  if (termino.length >= 2) {
    prisma.registroBusqueda
      .create({
        data: {
          termino: termino.toLowerCase(),
          entidad,
        },
      })
      .catch((error) => {
        // Un fallo en telemetría nunca debe afectar la respuesta del visitante
        console.error("Error al registrar tendencia de búsqueda:", error.message);
      });
  }
};

