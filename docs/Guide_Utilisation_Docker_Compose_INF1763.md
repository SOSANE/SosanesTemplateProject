# Guide d'utilisation pratique du template Docker Compose
## INF1763 - Techniques et outils professionnels de développement logiciel

---

## 1. Vue d'ensemble du template

Le template `docker-compose.template.yml` fourni est un environnement complet qui inclut :
- **Frontend React** (port 3000)
- **Backend Spring Boot** (port 8080)
- **Base de données PostgreSQL** (port 5432)
- **Cache Redis** (port 6379)
- **Nginx** (reverse proxy, optionnel)
- **Monitoring** (Prometheus + Grafana, optionnel)

### 1.1 Architecture déployée

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React:3000    │◄──►│   Spring:8080   │◄──►│   PostgreSQL    │
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
mon-projet-inf1763/
├── docker-compose.yml          # ← Le template renommé
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── database/
│   └── init.sql               # Scripts d'initialisation
├── nginx/
│   └── nginx.conf            # Configuration Nginx
└── .env                      # Variables d'environnement
```

---

## 3. Installation et configuration

### 3.1 Étape 1 : Copier et adapter le template

```bash
# 1. Copier le template dans votre projet
cp docker-compose.template.yml docker-compose.yml

# 2. Créer le fichier d'environnement
cp .env.example .env
```

**Contenu du fichier `.env` :**
```bash
# Base de données
POSTGRES_DB=monapp_db
POSTGRES_USER=monapp_user
POSTGRES_PASSWORD=motdepasse_securise
DATABASE_URL=jdbc:postgresql://db:5432/monapp_db

# JWT et sécurité
JWT_SECRET=votre-cle-secrete-tres-longue-et-complexe
JWT_EXPIRATION=86400

# Redis
REDIS_URL=redis://redis:6379

# Environnement
SPRING_PROFILES_ACTIVE=docker
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development

# Monitoring (optionnel)
GRAFANA_ADMIN_PASSWORD=admin123
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
docker-compose up -d

# Démarrage avec logs visibles
docker-compose up

# Démarrage avec rebuild forcé
docker-compose up --build
```

**Vérifier le statut :**
```bash
# Voir les conteneurs en cours
docker-compose ps

# Voir les logs
docker-compose logs

# Logs d'un service spécifique
docker-compose logs frontend
docker-compose logs backend
```

**Arrêter l'environnement :**
```bash
# Arrêt simple
docker-compose down

# Arrêt avec suppression des volumes
docker-compose down -v

# Arrêt avec suppression des images
docker-compose down --rmi all
```

### 4.2 Utilisation par profils

**Le template supporte plusieurs profils d'utilisation :**

**1. Développement (par défaut) :**
```bash
# Démarre : frontend, backend, db, redis
docker-compose up -d
```

**2. Production :**
```bash
# Démarre tout + nginx reverse proxy
docker-compose --profile production up -d
```

**3. Monitoring :**
```bash
# Démarre tout + prometheus + grafana
docker-compose --profile monitoring up -d
```

**4. Combinaison de profils :**
```bash
# Production avec monitoring
docker-compose --profile production --profile monitoring up -d
```

### 4.3 Accès aux services

**Une fois démarré, les services sont accessibles :**

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur React |
| Backend API | http://localhost:8080/api | API REST Spring Boot |
| Swagger UI | http://localhost:8080/swagger-ui.html | Documentation API |
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
docker-compose up -d

# 2. Vérifier que tout fonctionne
curl http://localhost:8080/actuator/health
curl http://localhost:3000

# 3. Développer (code dans frontend/ et backend/)
# Les changements sont automatiquement synchronisés

# 4. Voir les logs en cas de problème
docker-compose logs backend

# 5. Redémarrer un service après modification
docker-compose restart backend

# 6. Arrêter en fin de journée
docker-compose down
```

### 5.2 Tests et intégration

**Environnement de test isolé :**
```bash
# 1. Créer un environnement de test
cp docker-compose.yml docker-compose.test.yml

# 2. Modifier les ports pour éviter les conflits
# frontend: 3001:80
# backend: 8081:8080

# 3. Démarrer l'environnement de test
docker-compose -f docker-compose.test.yml up -d

# 4. Lancer les tests E2E
npm run cypress:run

# 5. Nettoyer après les tests
docker-compose -f docker-compose.test.yml down -v
```

### 5.3 Démonstration et présentation

**Préparation pour une soutenance :**
```bash
# 1. Nettoyer l'environnement
docker-compose down -v
docker system prune -f

# 2. Rebuild complet avec données fraîches
docker-compose up --build -d

# 3. Vérifier que tout fonctionne
docker-compose ps
curl http://localhost:8080/actuator/health

# 4. Charger des données de démonstration
docker-compose exec backend java -jar app.jar --spring.profiles.active=demo

# 5. Démarrer le monitoring pour impressionner
docker-compose --profile monitoring up -d
```

---

## 6. Dépannage et bonnes pratiques

### 6.1 Problèmes courants

**Problème : Port déjà utilisé**
```bash
# Erreur : "port is already allocated"
# Solution : Vérifier les processus utilisant le port
sudo lsof -i :3000
sudo lsof -i :8080

# Ou changer les ports dans docker-compose.yml
ports:
  - "3001:80"  # Au lieu de 3000:80
```

**Problème : Base de données non accessible**
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps db

# Vérifier les logs de la DB
docker-compose logs db

# Se connecter à la DB pour débugger
docker-compose exec db psql -U monapp_user -d monapp_db
```

**Problème : Backend ne démarre pas**
```bash
# Vérifier les logs détaillés
docker-compose logs backend

# Redémarrer avec rebuild
docker-compose up --build backend

# Vérifier les variables d'environnement
docker-compose exec backend env | grep DATABASE
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
  - "8080:8080"
  - "5005:5005"  # Port de debug
environment:
  - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```

### 6.3 Commandes utiles pour les étudiants

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
docker-compose exec db pg_dump -U monapp_user monapp_db > backup.sql

# Restaurer la base de données
docker-compose exec -T db psql -U monapp_user -d monapp_db < backup.sql
```

---


## 7. Exemples pratiques par équipe

### 7.1 Équipe débutante : Setup minimal

**Objectif :** Faire fonctionner l'application rapidement

**Étapes simplifiées :**
```bash
# 1. Cloner le template de base
git clone https://github.com/prof/inf1763-react-springboot-template.git mon-projet
cd mon-projet

# 2. Copier la configuration de base
cp docker-compose.template.yml docker-compose.yml
cp .env.example .env

# 3. Démarrer seulement les services essentiels
docker-compose up frontend backend db

# 4. Vérifier que ça fonctionne
curl http://localhost:8080/actuator/health
# Réponse attendue : {"status":"UP"}
```

**Configuration `.env` simplifiée :**
```bash
POSTGRES_DB=myapp
POSTGRES_USER=user
POSTGRES_PASSWORD=password
JWT_SECRET=mysecretkey
REACT_APP_API_URL=http://localhost:8080/api
```

### 7.2 Équipe intermédiaire : Avec cache et monitoring

**Objectif :** Ajouter Redis et monitoring basique

```bash
# 1. Démarrer avec Redis
docker-compose up frontend backend db redis

# 2. Vérifier Redis
docker-compose exec redis redis-cli ping
# Réponse attendue : PONG

# 3. Ajouter le monitoring
docker-compose --profile monitoring up -d

# 4. Accéder à Grafana
# URL: http://localhost:3001
# Login: admin / admin123
```

**Configuration backend pour Redis :**
```yaml
# Dans application-docker.yml
spring:
  redis:
    host: redis
    port: 6379
    timeout: 2000ms
  cache:
    type: redis
```

### 7.3 Équipe avancée : Configuration production

**Objectif :** Environnement proche de la production

```bash
# 1. Configuration complète avec Nginx
docker-compose --profile production --profile monitoring up -d

# 2. Vérifier le reverse proxy
curl http://localhost/api/health

# 3. Tester la scalabilité
docker-compose up --scale backend=3
```

**Configuration Nginx (`nginx/nginx.conf`) :**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8080;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://frontend:80;
        }
        
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## 8. Intégration avec le workflow de développement

### 8.1 Intégration Git

**Fichiers à committer :**
```bash
# À inclure dans Git
git add docker-compose.yml
git add frontend/Dockerfile
git add backend/Dockerfile
git add database/init.sql
git add nginx/nginx.conf

# À exclure (.gitignore)
.env
docker-compose.override.yml
postgres_data/
redis_data/
```

**Docker Compose override pour développement local :**
```yaml
# docker-compose.override.yml (non commité)
version: '3.8'
services:
  frontend:
    volumes:
      - ./frontend/src:/app/src:ro
    environment:
      - REACT_APP_DEBUG=true
      
  backend:
    volumes:
      - ./backend/src:/app/src:ro
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - LOGGING_LEVEL_ROOT=DEBUG
```

### 8.2 Intégration avec les tests

**Tests automatisés avec Docker :**
```bash
# Script de test (test.sh)
#!/bin/bash
set -e

echo "🧪 Démarrage des tests avec Docker Compose"

# 1. Nettoyer l'environnement
docker-compose -f docker-compose.test.yml down -v

# 2. Démarrer l'environnement de test
docker-compose -f docker-compose.test.yml up -d

# 3. Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 30

# 4. Lancer les tests backend
echo "🔧 Tests backend..."
docker-compose -f docker-compose.test.yml exec -T backend ./mvnw test

# 5. Lancer les tests frontend
echo "🎨 Tests frontend..."
docker-compose -f docker-compose.test.yml exec -T frontend npm test -- --coverage --watchAll=false

# 6. Tests E2E
echo "🌐 Tests E2E..."
docker-compose -f docker-compose.test.yml exec -T frontend npm run cypress:run

# 7. Nettoyer
docker-compose -f docker-compose.test.yml down -v

echo "✅ Tous les tests sont passés !"
```

### 8.3 Intégration CI/CD

**GitHub Actions avec Docker Compose :**
```yaml
# .github/workflows/ci.yml
name: CI with Docker Compose

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Create .env file
      run: |
        echo "POSTGRES_DB=testdb" >> .env
        echo "POSTGRES_USER=testuser" >> .env
        echo "POSTGRES_PASSWORD=testpass" >> .env
        echo "JWT_SECRET=testsecret" >> .env
    
    - name: Run tests with Docker Compose
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30
        docker-compose -f docker-compose.test.yml exec -T backend ./mvnw test
        docker-compose -f docker-compose.test.yml exec -T frontend npm test -- --coverage --watchAll=false
    
    - name: Cleanup
      run: docker-compose -f docker-compose.test.yml down -v
```

---

## 9. Conseils pédagogiques pour les professeurs

### 9.1 Distribution du template

**Option 1 : GitHub Classroom**
```bash
# Créer un repository template
gh repo create inf1763-docker-template --template --public

# Les étudiants peuvent ensuite :
gh repo create mon-projet --template prof/inf1763-docker-template
```

**Option 2 : Archive ZIP**
```bash
# Créer un package complet
zip -r inf1763-starter-kit.zip \
  docker-compose.template.yml \
  frontend/ \
  backend/ \
  database/ \
  .env.example \
  README.md
```

### 9.2 Exercices progressifs

**Semaine 1-2 : Découverte**
- Faire fonctionner le template de base
- Comprendre les services et leurs interactions
- Modifier les ports et variables d'environnement

**Semaine 3-4 : Personnalisation**
- Ajouter un nouveau service (ex: MongoDB)
- Modifier les Dockerfiles
- Créer des profils personnalisés

**Semaine 5-6 : Production**
- Configurer Nginx
- Ajouter le monitoring
- Optimiser les performances

### 9.3 Évaluation avec Docker Compose

**Critères d'évaluation :**
- ✅ Application démarre avec `docker-compose up`
- ✅ Tous les services sont accessibles
- ✅ Health checks fonctionnels
- ✅ Données persistantes entre redémarrages
- ✅ Configuration par environnement
- ✅ Monitoring opérationnel

**Script d'évaluation automatique :**
```bash
#!/bin/bash
# evaluate-project.sh

echo "📋 Évaluation automatique du projet Docker Compose"

# Test 1: Démarrage
echo "1️⃣ Test de démarrage..."
docker-compose up -d
sleep 30

# Test 2: Health checks
echo "2️⃣ Test des health checks..."
curl -f http://localhost:8080/actuator/health || exit 1
curl -f http://localhost:3000 || exit 1

# Test 3: Base de données
echo "3️⃣ Test de la base de données..."
docker-compose exec -T db psql -U user -d myapp -c "SELECT 1;" || exit 1

# Test 4: Persistance
echo "4️⃣ Test de persistance..."
docker-compose down
docker-compose up -d
sleep 20
curl -f http://localhost:8080/actuator/health || exit 1

echo "✅ Tous les tests sont passés !"
docker-compose down
```

---

## 10. Ressources et support

### 10.1 Documentation de référence

**Docker Compose :**
- [Documentation officielle](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/compose/compose-file/)
- [Best practices](https://docs.docker.com/develop/best-practices/)

**Debugging :**
- `docker-compose logs [service]` : Voir les logs
- `docker-compose exec [service] bash` : Se connecter au conteneur
- `docker-compose ps` : Statut des services
- `docker-compose top` : Processus en cours

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
docker-compose exec backend env | grep DATABASE
```

**Q: "Frontend ne se met pas à jour"**
```bash
# Vérifier le hot reload
docker-compose logs frontend
# Redémarrer le service
docker-compose restart frontend
```

**Canal de support recommandé :**
- Discord/Slack avec channels dédiés
- Issues GitHub pour bugs du template
- Sessions de lab avec support technique

---

## 11. Conclusion

Ce template Docker Compose est conçu pour :
- ✅ **Simplifier** le démarrage des projets étudiants
- ✅ **Standardiser** l'environnement de développement
- ✅ **Enseigner** les bonnes pratiques DevOps
- ✅ **Préparer** à l'environnement professionnel

**Prochaines étapes pour les étudiants :**
1. Maîtriser l'utilisation de base
2. Personnaliser selon les besoins du projet
3. Intégrer avec le pipeline CI/CD
4. Optimiser pour la production

**Pour les professeurs :**
- Adapter le template selon les projets choisis
- Créer des exercices progressifs
- Évaluer l'utilisation effective des outils
- Collecter les retours pour amélioration

---

*Ce guide est un document vivant qui évolue avec les retours d'expérience des étudiants et professeurs.*

