import { Request, Response } from 'express';
import { TaskModel } from '../models/Task';
import { TaskStatus } from '../models/types';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export class TaskController {
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      if (!title || title.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le titre de la tâche est requis'
        });
        return;
      }

      const task = await TaskModel.create({
        title: title.trim(),
        description: description?.trim(),
        user_id: userId
      });

      res.status(201).json({
        success: true,
        message: 'Tâche créée avec succès',
        data: task
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de la tâche'
      });
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const tasks = await TaskModel.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des tâches'
      });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const task = await TaskModel.findById(parseInt(id));

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Tâche non trouvée'
        });
        return;
      }

      // Vérifier que la tâche appartient à l'utilisateur
      if (task.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette tâche'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération de la tâche'
      });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      // Vérifier que la tâche existe et appartient à l'utilisateur
      const existingTask = await TaskModel.findById(parseInt(id));
      
      if (!existingTask) {
        res.status(404).json({
          success: false,
          message: 'Tâche non trouvée'
        });
        return;
      }

      if (existingTask.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette tâche'
        });
        return;
      }

      // Valider le status si fourni
      if (status && !Object.values(TaskStatus).includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status invalide'
        });
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (status !== undefined) updateData.status = status;

      const updatedTask = await TaskModel.update(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Tâche mise à jour avec succès',
        data: updatedTask
      });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la mise à jour de la tâche'
      });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      // Vérifier que la tâche existe et appartient à l'utilisateur
      const existingTask = await TaskModel.findById(parseInt(id));
      
      if (!existingTask) {
        res.status(404).json({
          success: false,
          message: 'Tâche non trouvée'
        });
        return;
      }

      if (existingTask.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette tâche'
        });
        return;
      }

      await TaskModel.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Tâche supprimée avec succès'
      });
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la suppression de la tâche'
      });
    }
  }
}