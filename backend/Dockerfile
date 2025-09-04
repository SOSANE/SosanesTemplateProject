# Image python de https://hub.docker.com/_/python/
FROM python:3.13.7-slim

# Variables d'environement
ENV TZ America/Toronto
ENV PYTHONDONTWRITEBYTECODE 1 
ENV PYTHONUNBUFFERED 1

# Déplacer vers le dossier backend
RUN mkdir /backend
WORKDIR /backend

# Installer les dépendances du backend
ADD requirements.txt /backend/
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 libpq-dev python3-dev postgresql postgresql-contrib curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip install -r requirements.txt


ADD . /backend/
CMD ["/bin/sh", "entrypoint.sh"]
EXPOSE 8000
