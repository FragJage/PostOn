import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserModel } from '../models/User';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      if (!username || username.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Le nom d\'utilisateur est requis'
        });
        return;
      }

      // Rechercher l'utilisateur existant ou le créer
      let user = await UserModel.findByUsername(username.trim());
      
      if (!user) {
        user = await UserModel.create({ username: username.trim() });
      }

      // Générer le token JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
      }
      
      const jwtOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
      };
      
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        jwtSecret,
        jwtOptions
      );

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            username: user.username
          },
          token
        }
      });
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la connexion'
      });
    }
  }

  static async verify(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token manquant'
        });
        return;
      }

      const token = authHeader.substring(7);
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
      }
      
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      const user = await UserModel.findById(decoded.userId);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username
          }
        }
      });
    } catch (error: any) {
      console.error('Erreur lors de la vérification du token:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  }
}