# Tasks

## 1. Utilidades y Middleware de Errores

- [x] 1.1 Modificar `src/utils/errores.js` para aceptar el parámetro opcional `detalles` (`crearError(mensaje, status, detalles = null)`) y verificar que se adjunte a `error.detalles`.
- [x] 1.2 Modificar `src/middlewares/manejadorErrores.js` para enviar `{ error: err.message, detalles: err.detalles }` cuando `err.detalles` esté definido y verificar que preserve `{ error: err.message }` en ausencia de detalles.

## 2. Capa de Servicio de Usuarios

- [x] 2.1 Crear `src/services/usuarios.service.js` con las funciones `obtenerUsuarios` y `obtenerUsuarioPorId`, incluyendo `{ rol: true }` y lanzando error 404 si el usuario no existe.
- [x] 2.2 Implementar en `src/services/usuarios.service.js` la función `crearUsuario`, asegurando el valor por defecto `id_rol = 3` y capturando la excepción `P2002` de Prisma para retornar un error 409 Conflict.
- [x] 2.3 Implementar en `src/services/usuarios.service.js` la función `actualizarUsuario` (operación PUT) y `eliminarUsuario`, gestionando `P2025` (404) y `P2002` (409).

## 3. Capa de Controladores y Rutas

- [x] 3.1 Crear `src/controllers/usuarios.controller.js` con los 5 controladores (`obtenerUsuarios`, `obtenerUsuarioPorId`, `crearUsuario`, `actualizarUsuario`, `eliminarUsuario`), validación de ID numérico y delegación a `next(err)`.
- [x] 3.2 Crear `src/routes/usuarios.routes.js` configurando los 5 endpoints con sus respectivos verbos HTTP y handlers.
- [x] 3.3 Montar `usuarios.routes.js` en `src/routes/index.routes.js` bajo la ruta `/api/usuarios`.

## 4. Validación e Integración

- [x] 4.1 Validar la consistencia de los artefactos de OpenSpec mediante `npm run openspec -- validate --change crud-usuarios`.
- [x] 4.2 Probar manualmente o mediante script los 5 endpoints y verificar que los códigos de respuesta (200, 201, 204, 404, 409) cumplan con la especificación.
