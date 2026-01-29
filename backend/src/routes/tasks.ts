import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Toutes les routes des tâches nécessitent une authentification
router.use(authenticateToken);

// GET /api/tasks - Récupérer toutes les tâches de l'utilisateur
router.get('/', TaskController.getAll);

// GET /api/tasks/:id - Récupérer une tâche spécifique
router.get('/:id', TaskController.getById);

// POST /api/tasks - Créer une nouvelle tâche
router.post('/', TaskController.create);

// PUT /api/tasks/:id - Mettre à jour une tâche
router.put('/:id', TaskController.update);

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/:id', TaskController.delete);

export default router;