#!/bin/bash

# =================================
# Script de démarrage rapide INF1763
# =================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
    # Vérifier que Docker fonctionne
    if ! docker info &> /dev/null; then
        log_error "Docker n'est pas démarré. Veuillez démarrer Docker Desktop."
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# Fonction pour initialiser le projet
initialize_project() {
    log_info "Initialisation du projet..."
    
    # Copier le template Docker Compose si nécessaire
    if [ ! -f "docker-compose.yml" ]; then
        if [ -f "docker-compose.template.yml" ]; then
            cp docker-compose.template.yml docker-compose.yml
            log_success "Template Docker Compose copié"
        else
            log_error "Fichier docker-compose.template.yml introuvable"
            exit 1
        fi
    fi
    
    # Créer le fichier .env si nécessaire
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success "Fichier .env créé à partir de .env.example"
            log_warning "N'oubliez pas de modifier les mots de passe dans .env"
        else
            log_warning "Fichier .env.example introuvable, création d'un .env minimal"
            cat > .env << EOF
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=UQO123?
JWT_SECRET=your-secret-key-change-this
REACT_APP_API_URL=http://localhost:8000/api
EOF
        fi
    fi
}

# Fonction pour nettoyer l'environnement
cleanup() {
    log_info "Nettoyage de l'environnement..."
    docker-compose down -v 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    log_success "Environnement nettoyé"
}

# Fonction pour démarrer les services
start_services() {
    local profile=${1:-""}
    
    log_info "Démarrage des services..."
    
    if [ -n "$profile" ]; then
        log_info "Utilisation du profil: $profile"
        docker-compose --profile "$profile" up -d
    else
        docker-compose up -d
    fi
    
    log_info "Attente du démarrage des services..."
    sleep 10
    
    # Vérifier que les services sont démarrés
    check_services
}

# Fonction pour vérifier les services
check_services() {
    log_info "Vérification des services..."
    
    # Vérifier le backend
    for i in {1..30}; do
        if curl -s http://localhost:8000/actuator/health > /dev/null 2>&1; then
            log_success "Backend démarré et accessible"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "Le backend n'a pas démarré dans les temps"
            show_logs
            exit 1
        fi
        sleep 2
    done
    
    # Vérifier le frontend
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        log_success "Frontend démarré et accessible"
    else
        log_warning "Frontend pas encore accessible (normal si en cours de build)"
    fi
    
    # Vérifier la base de données
    if docker-compose exec -T db pg_isready -U app_user > /dev/null 2>&1; then
        log_success "Base de données accessible"
    else
        log_warning "Base de données pas encore prête"
    fi
}

# Fonction pour afficher les logs
show_logs() {
    log_info "Affichage des logs récents..."
    docker-compose logs --tail=20
}

# Fonction pour afficher le statut
show_status() {
    log_info "Statut des services:"
    docker-compose ps
    
    echo ""
    log_info "Services accessibles:"
    echo "  🌐 Frontend:     http://localhost:5173"
    echo "  🔧 Backend API:  http://localhost:8000/api"
    echo "  📚 Swagger UI:   http://localhost:8000/"
    echo "  📊 Actuator:     http://localhost:8000/actuator"
    
    # Vérifier si monitoring est actif
    if docker-compose ps | grep -q prometheus; then
        echo "  📈 Prometheus:   http://localhost:9090"
        echo "  📊 Grafana:      http://localhost:3001 (admin/admin123)"
    fi
}

# Fonction pour afficher l'aide
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start [profile]    Démarrer l'application (profils: production, monitoring)"
    echo "  stop              Arrêter l'application"
    echo "  restart           Redémarrer l'application"
    echo "  status            Afficher le statut des services"
    echo "  logs [service]    Afficher les logs (optionnel: service spécifique)"
    echo "  clean             Nettoyer complètement l'environnement"
    echo "  test              Lancer les tests"
    echo "  help              Afficher cette aide"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Démarrage normal"
    echo "  $0 start production         # Démarrage avec Nginx"
    echo "  $0 start monitoring         # Démarrage avec monitoring"
    echo "  $0 logs backend             # Logs du backend seulement"
}

# Fonction principale
main() {
    case "${1:-start}" in
        "start")
            check_prerequisites
            initialize_project
            start_services "$2"
            show_status
            ;;
        "stop")
            log_info "Arrêt de l'application..."
            docker-compose down
            log_success "Application arrêtée"
            ;;
        "restart")
            log_info "Redémarrage de l'application..."
            docker-compose down
            start_services "$2"
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            if [ -n "$2" ]; then
                docker-compose logs "$2"
            else
                docker-compose logs
            fi
            ;;
        "clean")
            cleanup
            ;;
        "test")
            log_info "Lancement des tests..."
            if [ -f "docker-compose.test.yml" ]; then
                docker-compose -f docker-compose.test.yml up -d
                sleep 20
                docker-compose -f docker-compose.test.yml exec -T backend ./mvnw test
                docker-compose -f docker-compose.test.yml exec -T frontend npm test -- --coverage --watchAll=false
                docker-compose -f docker-compose.test.yml down -v
            else
                log_warning "Fichier docker-compose.test.yml introuvable"
            fi
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Commande inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Gestion des signaux pour un arrêt propre
trap 'log_warning "Interruption détectée, arrêt en cours..."; docker-compose down; exit 130' INT TERM

# Exécution du script
main "$@"

