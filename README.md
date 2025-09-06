# Template pour le projet de session INF1763

Template pour le projet de session INF1763 (Techniques et outils professionnels de développement logiciel), automne 2025. Remise du projet en décembre.

Ce template existe car nous n'avons pas encore décidé du sujet de projet. Voici les projet proposés:
1.	TaskFlow - Plateforme de gestion de tâches collaborative
2.	**ShopEasy** - Système de e-commerce simplifié
3.	KnowledgeHub - Plateforme de partage de connaissances
4.	FitTracker - Application de suivi fitness
5.	**BookingSystem** - Système de réservation
6.	QuizMaster - Plateforme de quiz et évaluations

Le tech stack de ce projet est inspiré du CAT Stack (application project thundercat) - Une collaboration entre Code for Canada & Public Service Commission of Canada

Référence:
- https://gitlab.com/thundercat-transition/project-thundercat/
- https://gitlab.com/thundercat-transition/cat-stack/

## Tech Stack
On se met d'accord sur la tech stack suivante, risque à être modifié: 
- Backend & API: Django 4.x (Python), Django Rest Framework (avec drf-spectacular)
- Cache: Redis
- Base de données: PostgreSQL +14
- Frontend: React/Redux +18 (Styling avec React Bootstrap, Tailwind CSS, Styled Components)
- Frontend testing: Vitest + React Testing Library
- Backend testing: Django's TestCase/DRF's APITestCase
- Outils CI/CD: Github Actions, container avec Docker
- Monitoring: Prometheus/Grafana
- (Potentiellement) Reverse proxy: Nginx

## Exécuter le projet
```sh
git clone https://github.com/SOSANE/SosanesTemplateProject.git
cd sosanestemplateproject
```

Exécuter avec Docker:
```sh
docker compose up --build
```

Attendre que tous les containers ont finis de build. L'interface Swagger UI pour le backend est accessible sur: http://localhost:8000/

![swagger-ui-interface](/docs/images/swagger-ui-interface.png)

### Exécuter des tests
```sh
docker exec -it project_backend bash
python manage.py test tests
```

### Créer un super-utilisateur (superuser)
```sh
docker exec -it project_backend bash
python manage.py createsuperuser
```

En accédant sur http://localhost:8000/api/admin, on peut se connecter sur le dashboard d'administrateur
![django-admin-login-page](/docs/images/django-admin-login-page.png)
![django-admin-interface](/docs/images/django-admin-interface.png)