# Guide d'utilisation pratique du template Docker Compose

---

## 1. Vue d'ensemble du template

Le template `docker-compose.yml` fourni est un environnement complet qui inclut :
- **Frontend React** (port 3000)
- **Backend Django** (port 8000)
- **Base de données PostgreSQL** (port 5432)
- **Cache Redis** (port 6379)
- **Nginx** (reverse proxy)
- **Monitoring** (Prometheus, port 9090 + Grafana, port 3001)

### 1.1 Architecture déployée

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React:5173    │◄──►│   Django:8000   │◄──►│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   Redis Cache   │
                    │     :6379       │
                    └─────────────────┘
```

---

## 2. Préparation de l'environnement

### 2.1 Prérequis

**Logiciels requis :**
```bash
# Vérifier Docker
docker --version
# Docker version 24.0.0 ou plus récent

# Vérifier Docker Compose
docker-compose --version
# Docker Compose version 2.20.0 ou plus récent

# Vérifier Git
git --version
```

**Ressources système minimales :**
- RAM : 8 GB minimum (16 GB recommandé)
- Espace disque : 10 GB libres
- CPU : 4 cœurs recommandés

### 2.2 Structure de projet requise

**Avant d'utiliser le template, votre projet doit avoir cette structure :**
```
SosanesTemplateProject/
├── docker-compose.yml          # ← Template
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── src/
├── db/
│   └── init.sql              # Scripts d'initialisation
├── monitoring/
│   └── prometheus.yml        # Configuration prometheus
├── nginx/
│   ├── Dockerfile
│   └── nginx-proxy.conf      # Configuration Nginx
└── .env.local                # Variables d'environnement
```

---

## 3. Installation et configuration

### 3.1 Étape 1 : Copier et adapter le template

```bash
# Créer le fichier d'environnement
cp .env.local.exemple .env.local
```

**Contenu du fichier `.env.local` :**
```bash
# Base de données
POSTGRES_USER=postgres
POSTGRES_PASSWORD= # Insérez un mot de passe
POSTGRES_DB=postgres

# Backend
DATABASE_NAME=${POSTGRES_DB}
DATABASE_USER=${POSTGRES_USER}
DATABASE_PASSWORD=${POSTGRES_DB}
DATABASE_HOST=db
DATABASE_PORT=5432

# Environnement
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
ENVIRONMENT=local

# Redis
REDIS_URL=redis://redis:6379

# Monitoring
GRAFANA_ADMIN_PASSWORD= # Insérez un mot de passe
```

### 3.2 Étape 2 : Créer les Dockerfiles

**Frontend Dockerfile (`frontend/Dockerfile`) :**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile (`backend/Dockerfile`) :**
```dockerfile
# Build stage
FROM openjdk:17-jdk-slim AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Production stage
FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
```

### 3.3 Étape 3 : Configuration de la base de données

**Script d'initialisation (`database/init.sql`) :**
```sql
-- Création des tables de base
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO users (email, password, name, role) VALUES 
('admin@example.com', '$2a$10$...', 'Admin User', 'ADMIN'),
('user@example.com', '$2a$10$...', 'Regular User', 'USER');

-- Index pour performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## 4. Utilisation pratique

### 4.1 Commandes de base

**Démarrer l'environnement complet :**
```bash
# Démarrage en arrière-plan
docker compose up -d

# Démarrage avec logs visibles
docker compose up

# Démarrage avec rebuild forcé
docker compose up --build
```

**Vérifier le statut :**
```bash
# Voir les conteneurs en cours
docker compose ps

# Voir les logs
docker compose logs

# Logs d'un service spécifique
docker compose logs frontend
docker compose logs backend
```

**Arrêter l'environnement :**
```bash
# Arrêt simple
docker compose down

# Arrêt avec suppression des volumes
docker compose down -v

# Arrêt avec suppression des images
docker compose down --rmi all
```

### 4.2 Utilisation par profils

**Le template supporte plusieurs profils d'utilisation :**

**1. Développement (par défaut) :**
```bash
# Démarre : frontend, backend, db, redis
docker compose up -d
```

**2. Production :**
```bash
# Démarre tout + nginx reverse proxy
docker compose --profile production up -d
```

**3. Monitoring :**
```bash
# Démarre tout + prometheus + grafana
docker compose --profile monitoring up -d
```

**4. Combinaison de profils :**
```bash
# Production avec monitoring
docker compose --profile production --profile monitoring up -d
```

### 4.3 Accès aux services

**Une fois démarré, les services sont accessibles :**

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Interface utilisateur React |
| Backend API | http://localhost:8000/api | API REST Spring Boot |
| Swagger UI | http://localhost:8000 | Documentation API |
| Base de données | localhost:5432 | PostgreSQL (via client DB) |
| Redis | localhost:6379 | Cache Redis |
| Prometheus | http://localhost:9090 | Métriques (si monitoring activé) |
| Grafana | http://localhost:3001 | Dashboards (si monitoring activé) |

---

## 5. Scénarios d'utilisation typiques

### 5.1 Développement quotidien

**Workflow typique d'un étudiant :**

```bash
# 1. Démarrer l'environnement le matin
docker compose up -d

# 2. Vérifier que tout fonctionne
curl http://localhost:8000
curl http://localhost:5173

# 3. Développer (code dans frontend/ et backend/)
# Les changements sont automatiquement synchronisés

# 4. Voir les logs en cas de problème
docker compose logs backend

# 5. Redémarrer un service après modification
docker compose restart backend

# 6. Arrêter en fin de journée
docker compose down
```

### 5.2 Tests et intégration

**Environnement de test isolé :**
```bash
# 1. Créer un environnement de test
cp docker-compose.yml docker-compose.test.yml

# 2. Modifier les ports pour éviter les conflits
# frontend: 5174:80
# backend: 8001:8080

# 3. Démarrer l'environnement de test
docker compose -f docker-compose.test.yml up -d

# 4. Lancer les tests E2E
npm run cypress:run

# 5. Nettoyer après les tests
docker compose -f docker-compose.test.yml down -v
```

### 5.3 Démonstration et présentation

**Préparation pour une soutenance :**
```bash
# 1. Nettoyer l'environnement
docker compose down -v
docker system prune -f

# 2. Rebuild complet avec données fraîches
docker compose up --build -d

# 3. Vérifier que tout fonctionne
docker compose ps
curl http://localhost:8000

# 4. Charger des données de démonstration
docker compose exec backend java -jar app.jar --spring.profiles.active=demo

# 5. Démarrer le monitoring pour impressionner
docker compose --profile monitoring up -d
```

---

## 6. Dépannage et bonnes pratiques

### 6.1 Problèmes courants

**Problème : Port déjà utilisé**
```bash
# Erreur : "port is already allocated"
# Solution : Vérifier les processus utilisant le port
sudo lsof -i :
sudo lsof -i :8000

# Ou changer les ports dans docker-compose.yml
ports:
  - "5174:80"  # Au lieu de 5173:80
```

**Problème : Base de données non accessible**
```bash
# Vérifier que PostgreSQL est démarré
docker compose ps db

# Vérifier les logs de la DB
docker compose logs db

# Se connecter à la DB pour débugger
docker compose exec db psql -U postgres -d postgres
```

**Problème : Backend ne démarre pas**
```bash
# Vérifier les logs détaillés
docker compose logs backend

# Redémarrer avec rebuild
docker compose up --build backend

# Vérifier les variables d'environnement
docker compose exec backend env | grep DATABASE_DB
```

### 6.2 Optimisations pour le développement

**Hot reload pour le frontend :**
```yaml
# Dans docker-compose.yml, ajouter pour le service frontend :
volumes:
  - ./frontend/src:/app/src:ro
  - ./frontend/public:/app/public:ro
environment:
  - CHOKIDAR_USEPOLLING=true
```

**Debug du backend :**
```yaml
# Pour le service backend, ajouter :
ports:
  - "8000:8000"
  - "5005:5005"  # Port de debug
```

### 6.3 Commandes utiles

**Monitoring des ressources :**
```bash
# Voir l'utilisation des ressources
docker stats

# Voir l'espace disque utilisé
docker system df

# Nettoyer les images inutilisées
docker image prune -f
```

**Sauvegarde et restauration :**
```bash
# Sauvegarder la base de données
docker compose exec db pg_dump -U postgres postgres > backup.sql

# Restaurer la base de données
docker compose exec -T db psql -U postgres -d postgres < backup.sql
```

---

## 10. Ressources et support

### 10.1 Documentation de référence

**Docker Compose :**
- [Documentation officielle](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/compose/compose-file/)
- [Best practices](https://docs.docker.com/develop/best-practices/)

**Debugging :**
- `docker compose logs [service]` : Voir les logs
- `docker compose exec [service] bash` : Se connecter au conteneur
- `docker compose ps` : Statut des services
- `docker compose top` : Processus en cours

### 10.2 Support étudiant

**FAQ communes :**

**Q: "Port already in use"**
```bash
# Trouver le processus utilisant le port
sudo lsof -i :3000
# Tuer le processus ou changer le port
```

**Q: "Database connection failed"**
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps db
# Vérifier les variables d'environnement
docker-compose exec backend env | grep DATABASE_DB
```

**Q: "Frontend ne se met pas à jour"**
```bash
# Vérifier le hot reload
docker compose logs frontend
# Redémarrer le service
docker compose restart frontend
```

