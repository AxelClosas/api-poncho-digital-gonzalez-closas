# Tasks

## 1. Configuración de Base de Datos y Catálogo

- [x] 1.1 Asegurar en la tabla `Estado` la existencia del registro `{ id: 5, nombre: "En_Reevaluacion" }`.

## 2. Middlewares de Dominio

- [x] 2.1 Crear `src/middlewares/postulaciones.middlewares.js` implementando `validarIdParam` y `validarCrearPostulacion`.
- [x] 2.2 Implementar en `src/middlewares/postulaciones.middlewares.js` el middleware `verificarPostulante` (validación de rol visitante y unicidad de postulación activa).
- [x] 2.3 Implementar en `src/middlewares/postulaciones.middlewares.js` los middlewares `validarActualizarPostulacion` y `verificarEstadoModificable`.
- [x] 2.4 Implementar en `src/middlewares/postulaciones.middlewares.js` los middlewares `verificarEvaluador`, `validarEvaluacion` y `verificarEstadoCancelable`.

## 3. Capa de Servicios

- [x] 3.1 Implementar en `src/services/postulaciones.service.js` las funciones `crearPostulacion`, `obtenerPostulaciones` y `obtenerPostulacionPorId` utilizando Prisma Client.
- [x] 3.2 Implementar en `src/services/postulaciones.service.js` la función `actualizarPostulacion`, transicionando automáticamente a `En_Reevaluacion` si el estado previo era `Mod_Solicitada`.
- [x] 3.3 Implementar en `src/services/postulaciones.service.js` la función `evaluarPostulacion` con transacción atómica para promover a Artesano (`id_rol = 2`) en caso de aprobación.
- [x] 3.4 Implementar en `src/services/postulaciones.service.js` la función `eliminarPostulacion`.

## 4. Controladores y Rutas

- [x] 4.1 Actualizar `src/controllers/postulaciones.controller.js` con controladores asíncronos y delegación a `next(error)`.
- [x] 4.2 Configurar `src/routes/postulaciones.routes.js` asociando la cadena de middlewares de dominio a cada endpoint.

## 5. Validación y Verificación

- [x] 5.1 Validar la consistencia de los artefactos de OpenSpec mediante `npx openspec validate flujo-postulaciones`.
- [x] 5.2 Ejecutar pruebas de integración verificando los 6 endpoints y todas las reglas de transición y negocio.
