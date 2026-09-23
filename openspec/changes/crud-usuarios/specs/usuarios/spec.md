# Spec Delta

## Purpose

Provee la interfaz y reglas de negocio para la gestión integral de cuentas de usuarios en Poncho Digital mediante operaciones RESTful, garantizando integridad referencial, asignación de roles y manejo centralizado de errores.

## ADDED Requirements

### Requirement: Obtención de todos los usuarios
El sistema SHALL proveer un endpoint `GET /api/usuarios` que retorna la lista completa de usuarios registrados, incluyendo su rol asociado (`rol`), con código de estado HTTP 200.

#### Scenario: Consulta exitosa de usuarios
- **WHEN** un cliente realiza una petición `GET` a `/api/usuarios`
- **THEN** el sistema responde con código HTTP 200 y un arreglo JSON con todos los usuarios registrados incluyendo el objeto de su rol asociado

### Requirement: Obtención de usuario por ID
El sistema SHALL proveer un endpoint `GET /api/usuarios/:id` que busca y retorna el usuario correspondiente al ID suministrado, incluyendo su rol asociado, con código HTTP 200. Si el usuario no existe, el sistema SHALL retornar código HTTP 404 con un mensaje explicativo.

#### Scenario: Usuario encontrado por ID
- **WHEN** un cliente realiza una petición `GET` a `/api/usuarios/:id` con un ID de usuario existente
- **THEN** el sistema responde con código HTTP 200 y el objeto JSON del usuario con su rol asociado

#### Scenario: Usuario no encontrado por ID
- **WHEN** un cliente realiza una petición `GET` a `/api/usuarios/:id` con un ID inexistente
- **THEN** el sistema responde con código HTTP 404 y un JSON `{ error: "Usuario no encontrado" }`

### Requirement: Creación de usuario
El sistema SHALL proveer un endpoint `POST /api/usuarios` que registra un nuevo usuario en la base de datos y retorna el usuario creado con código HTTP 201. Si el campo `id_rol` no es provisto, el sistema SHALL asignar el rol por defecto de visitante (id_rol = 3). Si el `email` o el `cuil` ya se encuentran registrados, el sistema SHALL rechazar la petición con código HTTP 409 y un objeto con detalles del conflicto.

#### Scenario: Creación exitosa de usuario
- **WHEN** un cliente realiza una petición `POST` a `/api/usuarios` con datos válidos de usuario
- **THEN** el sistema persiste el registro en la base de datos y retorna código HTTP 201 con los datos del nuevo usuario

#### Scenario: Conflicto por email o CUIL duplicado
- **WHEN** un cliente realiza una petición `POST` a `/api/usuarios` con un `email` o `cuil` que ya pertenece a otro usuario existente
- **THEN** el sistema responde con código HTTP 409, mensaje indicando que el email o CUIL ya se encuentra registrado y los detalles específicos del campo en conflicto

### Requirement: Actualización de usuario vía PUT
El sistema SHALL proveer un endpoint `PUT /api/usuarios/:id` para actualizar los datos de un usuario existente, retornando el usuario actualizado con código HTTP 200. Si el usuario no existe, SHALL retornar HTTP 404. Si se intenta actualizar con un `email` o `cuil` ya en uso por otro registro, el sistema SHALL retornar HTTP 409 con detalles.

#### Scenario: Actualización exitosa vía PUT
- **WHEN** un cliente realiza una petición `PUT` a `/api/usuarios/:id` con un ID existente y nuevos datos válidos
- **THEN** el sistema actualiza el registro y responde con código HTTP 200 y el objeto del usuario actualizado

#### Scenario: Actualización de usuario inexistente
- **WHEN** un cliente realiza una petición `PUT` a `/api/usuarios/:id` con un ID que no existe
- **THEN** el sistema responde con código HTTP 404 y mensaje de usuario no encontrado

#### Scenario: Conflicto por duplicidad en actualización
- **WHEN** un cliente realiza una petición `PUT` a `/api/usuarios/:id` enviando un `email` o `cuil` ya asignado a otro usuario
- **THEN** el sistema responde con código HTTP 409 y detalles del conflicto

### Requirement: Eliminación de usuario
El sistema SHALL proveer un endpoint `DELETE /api/usuarios/:id` que elimina el registro del usuario correspondiente y responde con código HTTP 204 sin contenido. Si el usuario no existe, el sistema SHALL retornar código HTTP 404.

#### Scenario: Eliminación exitosa
- **WHEN** un cliente realiza una petición `DELETE` a `/api/usuarios/:id` con un ID existente
- **THEN** el sistema elimina el registro y responde con código HTTP 204 sin cuerpo

#### Scenario: Eliminación de usuario inexistente
- **WHEN** un cliente realiza una petición `DELETE` a `/api/usuarios/:id` con un ID inexistente
- **THEN** el sistema responde con código HTTP 404 y mensaje de usuario no encontrado

### Requirement: Manejo de errores con detalles
El sistema SHALL centralizar el reporte de errores mediante el middleware de manejo de errores. Cuando se utilice la utilidad `crearError` con detalles adicionales, el sistema SHALL incluir el campo `detalles` en el JSON de respuesta.

#### Scenario: Error con detalles adicionales
- **WHEN** ocurre una excepción o validación fallida que incluye detalles
- **THEN** el middleware responde con el status HTTP correspondiente y un JSON estructurado `{ error: <mensaje>, detalles: <detalles> }`
