#!/bin/bash
# ============================================
# TicketAI Full Deployment Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Functions
log_info() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warn "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check Railway CLI
    if ! command -v railway &> /dev/null; then
        log_warn "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Check environment variables
    if [ -z "$VERCEL_TOKEN" ]; then
        log_warn "VERCEL_TOKEN not set. You may need to login manually."
    fi
    
    if [ -z "$RAILWAY_TOKEN" ]; then
        log_warn "RAILWAY_TOKEN not set. You may need to login manually."
    fi
    
    log_success "Prerequisites check complete"
}

# Deploy Frontend
deploy_frontend() {
    log_info "Deploying Frontend to Vercel..."
    
    cd "$PROJECT_DIR/frontend"
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm ci
    
    # Build
    log_info "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    if [ -n "$VERCEL_TOKEN" ]; then
        vercel --prod --token "$VERCEL_TOKEN" --yes
    else
        vercel --prod
    fi
    
    log_success "Frontend deployed successfully!"
    cd "$PROJECT_DIR"
}

# Deploy Backend
deploy_backend() {
    log_info "Deploying Backend to Railway..."
    
    cd "$PROJECT_DIR/backend"
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm ci
    
    # Build
    log_info "Building backend..."
    npm run build
    
    # Deploy to Railway
    if [ -n "$RAILWAY_TOKEN" ]; then
        railway up --service ticketai-backend
    else
        railway up
    fi
    
    log_success "Backend deployed successfully!"
    cd "$PROJECT_DIR"
}

# Run Database Migrations
run_migrations() {
    log_info "Running database migrations..."
    
    cd "$PROJECT_DIR/database"
    ./migrate.sh migrate
    
    log_success "Database migrations complete!"
    cd "$PROJECT_DIR"
}

# Health Check
health_check() {
    log_info "Running health checks..."
    
    # Wait for services to be ready
    sleep 5
    
    # Check frontend
    FRONTEND_URL=$(vercel --token "$VERCEL_TOKEN" ls ticketai 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
    if [ -n "$FRONTEND_URL" ]; then
        log_info "Checking frontend at $FRONTEND_URL..."
        if curl -f -s "$FRONTEND_URL" > /dev/null; then
            log_success "Frontend is healthy"
        else
            log_warn "Frontend health check failed"
        fi
    fi
    
    log_success "Health checks complete"
}

# Main deployment flow
main() {
    echo ""
    echo "=========================================="
    echo "  🚀 TicketAI Deployment"
    echo "=========================================="
    echo ""
    
    # Parse arguments
    SKIP_FRONTEND=false
    SKIP_BACKEND=false
    SKIP_MIGRATIONS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-frontend)
                SKIP_FRONTEND=true
                shift
                ;;
            --skip-backend)
                SKIP_BACKEND=true
                shift
                ;;
            --skip-migrations)
                SKIP_MIGRATIONS=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-frontend      Skip frontend deployment"
                echo "  --skip-backend       Skip backend deployment"
                echo "  --skip-migrations    Skip database migrations"
                echo "  --help               Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    
    if [ "$SKIP_MIGRATIONS" = false ]; then
        run_migrations
    fi
    
    if [ "$SKIP_BACKEND" = false ]; then
        deploy_backend
    fi
    
    if [ "$SKIP_FRONTEND" = false ]; then
        deploy_frontend
    fi
    
    health_check
    
    echo ""
    echo "=========================================="
    log_success "🎉 Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "Your TicketAI instance is now live:"
    echo "  Frontend: https://ticketai.vercel.app"
    echo "  Backend:  https://api.ticketai.app"
    echo ""
}

# Run main function
main "$@"
