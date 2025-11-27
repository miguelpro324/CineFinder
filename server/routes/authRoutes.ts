import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/check-username/:username', authController.checkUsername);
router.get('/auth/check-email/:email', authController.checkEmail);

export default router;
