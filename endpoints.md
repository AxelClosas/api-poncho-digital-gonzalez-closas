/api
  /usuarios
    Públicos
      /login - POST

    Protegidos
      /logout - POST
      
      /administradores - POST - crearAdministrador
      /:id/roles  - POST - agregarRol
      /:id/roles  - DELETE - eliminarRol

      /me - GET - obtenerMiPerfil

      / - GET - consultarUsuarios
      /:id - GET - obtenerUsuarioPorId

      /:id/activo - PATCH - cambiarEstadoActivo


  /pabellones
    Públicos
      / - GET - obtenerTodos
      /:id - GET - obtenerPorId

    Protegidos
      / - POST - crear
      /:id - POST - crear

      /:id - PUT - actualizar

      /:id - DELETE - eliminar


  /stands
    Públicos
      / - GET - obtenerTodos
      /:id - GET - obtenerPorId

    Protegidos
      / - POST - crear
      /:id - POST - crear
      
      /:id - PUT - actualizar
      
      /:id - DELETE - eliminar

  /sectores
      Públicos
      / - GET - obtenerTodos
      /:id - GET - obtenerPorId

    Protegidos
      / - POST - crear
      /:id - POST - crear
      
      /:id - PUT - actualizar
      
      /:id - DELETE - eliminar


  /emprendimientos
    Públicos
      / - GET - obtenerTodos
      /:id - GET - obtenerPorId
    Protegidos
      /:id - PATCH - actualizar

  /rubros
    Públicos
      / - GET - obtenerTodos
      /:id - GET - obtenerPorId

    Protegidos
      / - POST - crear
      
      /:id - PUT - actualizar
      
      /:id - DELETE - eliminar


  /roles
    Protegidos
      / - GET - listarRoles
      /:id - GET - obtenerRol

      / - POST - crearRol
      
      /:id - PUT - actualizarRol
      
      /:id - DELETE - eliminarRol

  /estados
    Protegidos
      / - GET - listarEstados
      /:id - GET - obtenerEstado

      / - POST - crearEstado
      
      /:id - PUT - actualizarEstado
      
      /:id - DELETE - eliminarEstado

  /productos
    Públicos
      / - GET - consultarProductos
      /:id - GET - obtenerProductoPorId

    Protegidos
      /me/mis-productos - GET - listarMisProductos

      / - POST - crearProducto

      /:id - PUT - actualizarProducto

      /:id - DELETE - eliminarProducto

  
  /inscripciones
    Públicos
      /postularse - POST - postularse
    
    Protegidos
      / - GET - consultarInscripciones
      /:id/estado - PATCH - cambiarEstadoInscripcion