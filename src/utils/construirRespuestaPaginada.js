export const construirRespuestaPaginada = (
    registrosDto,
    totalRegistros,
    pagina,
    limite
  ) => {
    const { nombre, datos } = registrosDto
    const paginaSegura =
      Math.max(1, Number(pagina) || 1)

    const limiteSeguro =
      Math.max(1, Number(limite) || 10)

    const totalRegistrosSeguro =
      Math.max(0, Number(totalRegistros) || 0);

    const totalPaginas =
      Math.ceil(totalRegistrosSeguro / limiteSeguro);

    return {
      [nombre]: datos,
      paginacion: {
        pagina: paginaSegura,
        limite: limiteSeguro,
        total: totalRegistrosSeguro,
        totalPaginas: totalPaginas
      },
    };

}