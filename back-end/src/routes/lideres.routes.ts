import { Router } from 'express'
import { LideresController } from '../controllers/lideres.controller'

const router = Router()
const controllerLideres = new LideresController()

router.get('/', controllerLideres.getAllLideres)
router.post('/', controllerLideres.createLider)
router.put('/:id', controllerLideres.updateLider)
router.delete('/:id', controllerLideres.removeLider)

export default router
