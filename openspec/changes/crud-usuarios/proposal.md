# Proposal

## Why

La API requiere la gestión completa de la entidad `Usuario`, permitiendo administrar las cuentas y perfiles de los usuarios que interactúan con la plataforma Poncho Digital (visitantes, artesanos y administradores). Implementar este CRUD sienta las bases de la gestión de identidad y usuarios del sistema, integrando el manejo de errores centralizado y el modelo de datos de Prisma bajo el patrón arquitectónico MVC con capa de servicios.

## What Changes

- **Controlador de Usuarios**: Creación de `src/controllers/usuarios.controller.js` con las funciones controladoras para los 5 endpoints REST (`obtenerUsuarios`, `obtenerUsuarioPorId`, `crearUsuario`, `actualizarUsuario`, `eliminarUsuario`).
- **Servicio de Usuarios**: Creación de `src/services/usuarios.service.js` con la lógica de negocio y acceso a base de datos mediante Prisma Client (`prisma.usuario`), resolviendo consultas con inclusión del `rol` y capturando excepciones de unicidad (`P2002`) y no encontrado (`P2025`).
- **Rutas de Usuarios**: Creación de `src/routes/usuarios.routes.js` exponiendo los 5 endpoints HTTP y montaje en `src/routes/index.routes.js` bajo el prefijo `/api/usuarios`.
- **Actualización de `crearError`**: Modificación de `src/utils/errores.js` para admitir un parámetro opcional `detalles` y asignarlo como `error.detalles`.
- **Actualización de `manejadorErrores`**: Modificación de `src/middlewares/manejadorErrores.js` para incluir `detalles: err.detalles` en la respuesta JSON cuando esté presente.

## Capabilities

### New Capabilities
- `usuarios`: Operaciones CRUD completas para la entidad Usuario, soporte de relaciones de rol, códigos de estado HTTP estándar (200, 201, 204, 404, 409) y respuesta de errores estructurada con detalles.

### Modified Capabilities
<!-- No existing capabilities to modify -->

## Impact

- **Código Afectado**:
  - `src/utils/errores.js` (firma extendida)
  - `src/middlewares/manejadorErrores.js` (formato de respuesta con detalles)
  - `src/routes/index.routes.js` (incorporación de `/api/usuarios`)
- **Nuevos Archivos**:
  - `src/routes/usuarios.routes.js`
  - `src/controllers/usuarios.controller.js`
  - `src/services/usuarios.service.js`
- **APIs**:
  - `GET /api/usuarios` (200 OK)
  - `GET /api/usuarios/:id` (200 OK / 404 Not Found)
  - `POST /api/usuarios` (201 Created / 409 Conflict)
  - `PUT /api/usuarios/:id` (200 OK / 404 Not Found / 409 Conflict)
  - `DELETE /api/usuarios/:id` (204 No Content / 404 Not Found)
