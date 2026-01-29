import { Router } from 'express';
import authRoutes from './auth';
import taskRoutes from './tasks';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des tâches
router.use('/tasks', taskRoutes);

// Route de test
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Post\'On fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

export default router;