import { Router } from 'express';
import { archiveController } from '../controllers/archiveController.js';

const router = Router();

// Archive Item routes
router.post('/archive-items', archiveController.createArchiveItem);
router.get('/archive-items', archiveController.getAllArchiveItems);
router.get('/archive-items/:id', archiveController.getArchiveItemById);
router.get('/archive-items/:id/file', archiveController.getArchiveItemFile);
router.put('/archive-items/:id', archiveController.updateArchiveItem);
router.delete('/archive-items/:id', archiveController.deleteArchiveItem);

export default router;
