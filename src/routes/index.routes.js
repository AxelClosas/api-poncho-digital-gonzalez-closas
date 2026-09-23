import { Router } from 'express'

import postulacionesRoutes from './postulaciones.routes.js'
// import productosRoutes from './productos.routes.js'
import usuariosRoutes from './usuarios.routes.js'

const router = Router()

router.use('/postulaciones', postulacionesRoutes)
// router.use('/productos', productosRoutes)
router.use('/usuarios', usuariosRoutes)

export default router

