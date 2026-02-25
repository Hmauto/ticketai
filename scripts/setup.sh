#!/bin/bash
# ============================================
# TicketAI Initial Setup Script
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
    echo -e "${BLUE}[SETUP]${NC} $1"
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
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ required. Found: $(node -v)"
        exit 1
    fi
    
    log_success "Node.js $(node -v) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "npm $(npm -v) found"
}

# Setup Frontend
setup_frontend() {
    log_info "Setting up Frontend..."
    
    cd "$PROJECT_DIR/frontend"
    
    # Create package.json if it doesn't exist
    if [ ! -f package.json ]; then
        log_info "Creating package.json..."
        cat > package.json << 'EOF'
{
  "name": "ticketai-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:ci": "jest --ci --coverage"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@sentry/nextjs": "^7.80.0",
    "@supabase/supabase-js": "^2.38.0",
    "tailwindcss": "^3.3.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "^14.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
EOF
    fi
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    # Create basic directory structure
    mkdir -p src/{components,pages,lib,styles,types}
    
    log_success "Frontend setup complete!"
    cd "$PROJECT_DIR"
}

# Setup Backend
setup_backend() {
    log_info "Setting up Backend..."
    
    cd "$PROJECT_DIR/backend"
    
    # Create package.json if it doesn't exist
    if [ ! -f package.json ]; then
        log_info "Creating package.json..."
        cat > package.json << 'EOF'
{
  "name": "ticketai-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "test": "jest",
    "test:ci": "jest --ci --coverage",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx src/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.5.0",
    "@supabase/supabase-js": "^2.38.0",
    "openai": "^4.14.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4",
    "winston": "^3.11.0",
    "@sentry/node": "^7.80.0",
    "@sentry/profiling-node": "^1.2.6",
    "bull": "^4.11.5",
    "ioredis": "^5.3.2",
    "@sendgrid/mail": "^7.7.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/cors": "^2.8.15",
    "@types/node": "^20.8.0",
    "@types/jsonwebtoken": "^9.0.4",
    "@types/bcryptjs": "^2.4.5",
    "typescript": "^5.2.0",
    "tsx": "^3.14.0",
    "prisma": "^5.5.0",
    "eslint": "^8.52.0",
    "@typescript-eslint/eslint-plugin": "^6.9.0",
    "@typescript-eslint/parser": "^6.9.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.6",
    "ts-jest": "^29.1.1"
  }
}
EOF
    fi
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm install
    
    # Create directory structure
    mkdir -p src/{config,routes,controllers,services,middleware,types,utils}
    
    # Create tsconfig.json
    if [ ! -f tsconfig.json ]; then
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    fi
    
    log_success "Backend setup complete!"
    cd "$PROJECT_DIR"
}

# Setup Environment Files
setup_env() {
    log_info "Setting up environment files..."
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_success "Created .env file from .env.example"
        log_warn "Please edit .env and fill in your actual values!"
    else
        log_warn ".env file already exists, skipping"
    fi
    
    # Create frontend .env.local
    if [ ! -f "$PROJECT_DIR/frontend/.env.local" ]; then
        cat > "$PROJECT_DIR/frontend/.env.local" << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://zywvnaactgvetvfidmzl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rYbGjBJmwDqrB08sgbHc5A_L7joozsT
NEXT_PUBLIC_SENTRY_DSN=
EOF
        log_success "Created frontend/.env.local"
    fi
    
    # Create backend .env
    if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
        cat > "$PROJECT_DIR/backend/.env" << 'EOF'
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ticketai
SUPABASE_URL=https://zywvnaactgvetvfidmzl.supabase.co
SUPABASE_SERVICE_KEY=

# AI
OPENAI_API_KEY=

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Monitoring
SENTRY_DSN=
LOG_LEVEL=debug
EOF
        log_success "Created backend/.env"
    fi
}

# Setup Git Hooks
setup_git_hooks() {
    log_info "Setting up Git hooks..."
    
    cd "$PROJECT_DIR"
    
    if [ -d .git ]; then
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
cd frontend && npm run lint || exit 1
cd ../backend && npm run lint || exit 1

echo "Pre-commit checks passed!"
EOF
        chmod +x .git/hooks/pre-commit
        log_success "Git hooks configured"
    else
        log_warn "Not a git repository, skipping git hooks"
    fi
}

# Main setup flow
main() {
    echo ""
    echo "=========================================="
    echo "  🚀 TicketAI Setup"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    setup_env
    setup_frontend
    setup_backend
    setup_git_hooks
    
    echo ""
    echo "=========================================="
    log_success "🎉 Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "  1. Edit .env files with your actual values"
    echo "  2. Run: ./scripts/seed.sh to seed the database"
    echo "  3. Run: ./scripts/deploy.sh to deploy"
    echo ""
    echo "Development:"
    echo "  Frontend: cd frontend && npm run dev"
    echo "  Backend:  cd backend && npm run dev"
    echo ""
}

# Run main function
main "$@"
