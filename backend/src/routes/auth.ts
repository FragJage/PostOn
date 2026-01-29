import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// POST /api/auth/login - Connexion avec nom d'utilisateur
router.post('/login', AuthController.login);

// GET /api/auth/verify - Vérifier la validité du token
router.get('/verify', AuthController.verify);

export default router;