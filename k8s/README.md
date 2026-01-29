# PostOn - Kubernetes Deployment

Déploiement de l'application PostOn sur Oracle Cloud Kubernetes.

## Architecture

- **Frontend**: React SPA servi par nginx (LoadBalancer)
- **Backend**: Node.js API Express (ClusterIP)
- **Database**: PostgreSQL 16 avec volume persistant (ClusterIP)
- **Init Container**: Clone le repo GitHub et build le code automatiquement

## Prérequis

- Cluster Kubernetes configuré (Oracle Cloud OKE)
- `kubectl` configuré avec accès au cluster
- Connexion au cluster Oracle Cloud

## Structure des fichiers

```
k8s/
├── namespace.yaml          # Namespace frag-wksp
├── configmap.yaml          # Variables d'environnement non-sensibles
├── secret.yaml             # Credentials (DB_PASSWORD, JWT_SECRET)
├── postgres.yaml           # PostgreSQL + Service + PVC
├── backend.yaml            # Backend API + Service
├── frontend.yaml           # Frontend nginx + Service LoadBalancer
└── init-db-job.yaml        # Job d'initialisation DB (one-time)
```

## Déploiement

### 1. Créer le namespace et les configurations

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
```

### 2. Déployer PostgreSQL

```bash
kubectl apply -f k8s/postgres.yaml
```

Attendre que PostgreSQL soit ready :
```bash
kubectl wait --for=condition=ready pod -l app=postgres -n frag-wksp --timeout=120s
```

### 3. Initialiser la base de données

```bash
kubectl apply -f k8s/init-db-job.yaml
```

Vérifier que le job s'est exécuté avec succès :
```bash
kubectl get jobs -n frag-wksp
kubectl logs -n frag-wksp job/init-db
```

### 4. Déployer le backend

```bash
kubectl apply -f k8s/backend.yaml
```

### 5. Déployer le frontend

```bash
kubectl apply -f k8s/frontend.yaml
```

### Déploiement complet (une seule commande)

```bash
kubectl apply -f k8s/
```

## Vérification du déploiement

### Vérifier les pods

```bash
kubectl get pods -n frag-wksp
```

Résultat attendu :
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
postgres-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
```

### Vérifier les services

```bash
kubectl get services -n frag-wksp
```

### Obtenir l'IP publique du frontend

```bash
kubectl get service frontend-service -n frag-wksp
```

L'application sera accessible via l'EXTERNAL-IP du LoadBalancer.

## Logs et debugging

### Voir les logs du backend

```bash
kubectl logs -n frag-wksp -l app=backend -f
```

### Voir les logs du frontend

```bash
kubectl logs -n frag-wksp -l app=frontend -f
```

### Voir les logs de PostgreSQL

```bash
kubectl logs -n frag-wksp -l app=postgres -f
```

### Voir les logs de l'init container (build)

```bash
# Backend
kubectl logs -n frag-wksp -l app=backend -c git-clone-and-build

# Frontend
kubectl logs -n frag-wksp -l app=frontend -c git-clone-and-build
```

### Accéder à un pod en mode interactif

```bash
kubectl exec -it -n frag-wksp <pod-name> -- sh
```

## Mise à jour de l'application

Pour déployer une nouvelle version après un commit Git :

```bash
# Redémarrer les deployments (force rebuild depuis GitHub)
kubectl rollout restart deployment backend -n frag-wksp
kubectl rollout restart deployment frontend -n frag-wksp
```

## Configuration des secrets (production)

⚠️ **IMPORTANT**: Avant le déploiement en production, modifier les secrets dans `secret.yaml` :

```bash
# Générer un nouveau mot de passe DB
echo -n "your_secure_password" | base64

# Générer un nouveau JWT secret (min 32 caractères)
echo -n "your_jwt_secret_key_min_32_chars" | base64
```

Remplacer les valeurs dans [secret.yaml](k8s/secret.yaml) puis réappliquer :

```bash
kubectl apply -f k8s/secret.yaml
kubectl rollout restart deployment backend -n frag-wksp
```

## Storage Class Oracle Cloud

Si la storage class `oci-bv` n'existe pas, vérifier les classes disponibles :

```bash
kubectl get storageclass
```

Adapter la valeur dans [postgres.yaml](k8s/postgres.yaml) selon votre cluster.

## Suppression complète

```bash
# Supprimer tous les composants
kubectl delete -f k8s/

# Ou supprimer uniquement le namespace (supprime tout)
kubectl delete namespace frag-wksp
```

⚠️ **Attention**: Cela supprimera également le PVC et les données PostgreSQL.

## Troubleshooting

### Les pods ne démarrent pas (ImagePullBackOff)

Vérifier que les images sont accessibles :
```bash
kubectl describe pod <pod-name> -n frag-wksp
```

### Init container en erreur

Voir les logs de l'init container :
```bash
kubectl logs <pod-name> -n frag-wksp -c git-clone-and-build
```

### Backend ne se connecte pas à PostgreSQL

Vérifier les variables d'environnement :
```bash
kubectl exec -n frag-wksp <backend-pod> -- env | grep DB
```

Tester la connexion à PostgreSQL :
```bash
kubectl exec -it -n frag-wksp <backend-pod> -- sh
nc -zv postgres-service 5432
```

### PVC en état Pending

Vérifier les événements :
```bash
kubectl describe pvc postgres-pvc -n frag-wksp
```

S'assurer que la storage class existe et est configurée pour le provisionnement dynamique.

## Endpoints utiles

- **Frontend**: `http://<EXTERNAL-IP>/`
- **Backend Health**: `http://<backend-pod-ip>:3001/health`
- **API**: `http://<EXTERNAL-IP>/api/...` (proxied par nginx)

## Notes

- Les init containers clonent le repo public GitHub à chaque déploiement/restart
- Le build est effectué dans l'init container, pas d'images Docker custom nécessaires
- Les volumes `emptyDir` sont partagés entre init et main containers
- PostgreSQL utilise un PVC pour la persistance des données
- Le frontend nginx proxy les requêtes `/api` vers le backend
