import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Vérifier que l'utilisateur existe toujours
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    req.user = {
      userId: user.id,
      username: user.username
    };

    next();
  } catch (error: any) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'authentification'
      });
    }
  }
};