#!/bin/bash

# Créer fichiers de migrations
python manage.py makemigrations

# Migrer application
python manage.py migrate auth
python manage.py migrate admin
python manage.py migrate authtoken
python manage.py migrate contenttypes
python manage.py migrate sessions
python manage.py migrate backend_models
python manage.py migrate user_management_models



# Application accessible sur http://localhost:8000
python manage.py runserver 0.0.0.0:8000