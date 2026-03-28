import { Router } from 'express'
import { MaterialController } from '../controllers/material.controller'
import upload from '../config/upload'

const router = Router()
const controller = new MaterialController()

router.get('/', controller.getAllMateriais)
router.get('/download/:id', controller.downloadMaterial)
router.post('/', upload.single('material'), controller.createMaterial)
router.put('/:id', upload.single('material'), controller.updateMaterial)
router.delete('/:id', controller.removeMaterial)

export default router
