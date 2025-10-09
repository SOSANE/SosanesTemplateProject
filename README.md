# Template pour le projet de session INF1763

Template de projet de développement d'application utilisant: Python (Django), React et Postgres.

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
- Reverse proxy: Nginx

## Exécuter le projet
```sh
git clone https://github.com/SOSANE/SosanesTemplateProject.git
cd SosanesTemplateProject
```

Copier les variables d'environnement
```sh
cp .env.local.exemple .env.local
```
Modifier `DATABASE_PASSWORD` & `GRAFANA_ADMIN_PASSWORD` dans `.env.local`
```dotenv
# Base de données
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<Insérez un mot de passe>
POSTGRES_DB=postgres

# ...

# Monitoring
GRAFANA_ADMIN_PASSWORD=<Insérez un mot de passe>
```


Exécuter avec Docker:
```sh
docker compose up --build -d
```

Attendre que tous les containers ont finis de build. L'interface Swagger UI pour le backend est accessible sur: http://localhost:8000/
![swagger-ui-interface](/docs/images/swagger-ui-interface.png)


Le frontend est accessible avec http://localhost:5173/
![frontend-interface](/docs/images/frontend-interface.png)

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