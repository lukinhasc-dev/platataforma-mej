import { Router } from 'express'
import { MaterialController } from '../controllers/material.controller'
import { authMiddleware } from '../middlewares/auth'
import upload from '../config/upload'

const router = Router()
const controller = new MaterialController()

router.get('/', controller.getAllMateriais)
router.get('/download/:id', controller.downloadMaterial)
router.post('/', authMiddleware, upload.single('material'), controller.createMaterial)
router.put('/:id', authMiddleware, upload.single('material'), controller.updateMaterial)
router.delete('/:id', authMiddleware, controller.removeMaterial)

export default router
