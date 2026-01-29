import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP toutes les 15 minutes
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

app.use(limiter);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Post\'On! 📝',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify'
      },
      tasks: {
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      }
    }
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
});

// Middleware de gestion des erreurs globales
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur non gérée:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Post'On démarré sur http://localhost:${PORT}`);
  console.log(`📖 Documentation disponible sur http://localhost:${PORT}`);
  console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

export default app;