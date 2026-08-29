export const logger = (req, res, next) => {
  const inicio = Date.now()

  res.on('finish', () => {
    const ms = Date.now() - inicio
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${ms}ms)`)
  })

  /* Como funciona el método res.on ? 
    El método res.on es un método de Node.js que permite registrar un evento.
    En este caso, estamos registrando un evento que se ejecuta cuando la respuesta ha finalizado.
    Cuando la respuesta ha finalizado, se ejecuta la función que le pasamos como parámetro.
    Dentro de la función, calculamos la duración de la petición y la mostramos por consola.
    Finalmente, llamamos a next() para pasar el control al siguiente middleware.
  */

  next()
}