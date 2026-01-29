# Post'On - Todo List Application

Une application de gestion de tâches simple et efficace construite avec React et Node.js.

## Architecture

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Base de données**: PostgreSQL

## Prérequis

- Node.js (v16+)
- PostgreSQL (v12+)
- npm ou yarn

## Installation et Configuration

### 1. Configuration de la base de données

Assurez-vous que PostgreSQL est installé et en cours d'exécution sur votre machine.

```bash
# Créer la base de données
CREATE USER poston_user WITH PASSWORD 'poston_secret';
CREATE DATABASE poston_db OWNER poston_user;
```

### 2. Installation du backend

```bash
cd backend
yarn install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditez le fichier .env avec vos paramètres de base de données

# Initialiser la base de données
yarn run init-db

# Compiler le TypeScript
yarn run build

# Lancer le serveur de développement
yarn run dev
```

Le serveur backend sera accessible sur http://localhost:3001

### 3. Installation du frontend

```bash
cd frontend
yarn install

# Copier et configurer les variables d'environnement
cp .env.example .env

# Lancer l'application de développement
yarn start
```

L'application frontend sera accessible sur http://localhost:3000

## Scripts disponibles

### Backend

- `yarn run dev` - Lance le serveur en mode développement avec hot-reload
- `yarn run build` - Compile le TypeScript
- `yarn start` - Lance le serveur en production
- `yarn run init-db` - Initialise la base de données

### Frontend

- `yarn start` - Lance l'application en mode développement
- `yarn run build` - Compile l'application pour la production
- `yarn test` - Lance les tests
- `yarn run eject` - Éjecte la configuration Create React App

## Fonctionnalités

- ✅ Authentification simple par nom d'utilisateur
- ✅ Création, modification, suppression de tâches
- ✅ États des tâches : En attente, En cours, Terminée
- ✅ Interface responsive
- ✅ Recherche et filtrage des tâches
- ✅ Persistance des données en base PostgreSQL

## Structure du projet

```
PostOn/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration base de données
│   │   ├── controllers/     # Logique métier
│   │   ├── middleware/      # Middleware Express
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── server.ts        # Point d'entrée serveur
│   │   └── initDb.ts        # Script d'initialisation DB
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/      # Composants React
    │   ├── contexts/        # Contexts React (Auth)
    │   ├── hooks/           # Hooks personnalisés
    │   ├── services/        # Services API
    │   ├── types/           # Types TypeScript
    │   └── App.tsx          # Composant principal
    ├── package.json
    └── .env.example
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/verify` - Vérification du token

### Tâches
- `GET /api/tasks` - Récupérer toutes les tâches de l'utilisateur
- `POST /api/tasks` - Créer une nouvelle tâche
- `GET /api/tasks/:id` - Récupérer une tâche spécifique
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

### Santé
- `GET /api/health` - Vérification de l'état de l'API

## Déploiement avec Docker (à venir)

Le projet est préparé pour le déploiement en conteneurs Oracle Cloud.

## Contribution

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

MIT License