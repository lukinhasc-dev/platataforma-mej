import { Router } from 'express'
import { LideresController } from '../controllers/lideres.controller'
import { authMiddleware } from '../middlewares/auth'
import path from 'path'

const router = Router()
const controllerLideres = new LideresController()

router.get('/', authMiddleware, controllerLideres.getAllLideres)
router.post('/', authMiddleware, controllerLideres.createLider)
router.post('/login', controllerLideres.loginLider)
router.get('/painel', authMiddleware, (req, res) => {
    res.sendFile(path.join(process.cwd(), '..', 'front-end', 'admin.html'))
})

router.put('/:id', authMiddleware, controllerLideres.updateLider)
router.delete('/:id', authMiddleware, controllerLideres.removeLider)

export default router
