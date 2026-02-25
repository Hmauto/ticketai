#!/bin/bash
# ============================================
# TicketAI Database Seeding Script
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
    echo -e "${BLUE}[SEED]${NC} $1"
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

# Check database connection
check_database() {
    log_info "Checking database connection..."
    
    if [ -z "$DATABASE_URL" ]; then
        # Try to load from .env file
        if [ -f "$PROJECT_DIR/backend/.env" ]; then
            export $(grep -v '^#' "$PROJECT_DIR/backend/.env" | xargs)
        fi
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL not set. Please set it before running this script."
        exit 1
    fi
    
    # Test connection
    if ! psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        log_error "Could not connect to database. Please check your DATABASE_URL."
        exit 1
    fi
    
    log_success "Database connection OK"
}

# Seed demo data
seed_demo_data() {
    log_info "Seeding demo data..."
    
    psql "$DATABASE_URL" << 'EOF'
-- Create demo tenant
INSERT INTO tenants (id, name, slug, plan, settings)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Demo Company',
    'demo-company',
    'pro',
    '{"features": ["ai_suggestions", "analytics", "integrations"]}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Create demo users
INSERT INTO users (id, tenant_id, email, first_name, last_name, role, skills, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin@demo.com', 'Admin', 'User', 'admin', ARRAY['management', 'technical'], true),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'agent1@demo.com', 'Support', 'Agent', 'agent', ARRAY['billing', 'technical'], true),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'agent2@demo.com', 'Senior', 'Agent', 'agent', ARRAY['billing', 'sales'], true),
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'manager@demo.com', 'Support', 'Manager', 'manager', ARRAY['management'], true)
ON CONFLICT DO NOTHING;

-- Create demo teams
INSERT INTO teams (id, tenant_id, name, description, skills)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Billing Team', 'Handles billing and payment issues', ARRAY['billing', 'payments']),
    ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Technical Support', 'Handles technical issues and bugs', ARRAY['technical', 'bugs']),
    ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Sales Team', 'Handles pre-sales and upgrade questions', ARRAY['sales', 'upgrades'])
ON CONFLICT DO NOTHING;

-- Assign team members
INSERT INTO team_members (team_id, user_id, is_team_lead)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', true),
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', false),
    ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', true),
    ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', false)
ON CONFLICT DO NOTHING;

-- Create demo tickets
INSERT INTO tickets (id, tenant_id, source, subject, body, customer_email, customer_name, sentiment, sentiment_score, category, priority, status, assigned_to, assigned_team, tags)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440000', 'email', 'Cannot access my account', 'I am unable to log into my account. It says my password is incorrect but I am sure it is right.', 'customer1@example.com', 'John Doe', 'negative', -0.6, 'technical', 'high', 'open', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', ARRAY['login', 'urgent']),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440000', 'email', 'Question about my invoice', 'I was charged twice for my subscription this month. Can you help me get a refund?', 'customer2@example.com', 'Jane Smith', 'neutral', 0.0, 'billing', 'medium', 'open', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', ARRAY['billing', 'refund']),
    ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440000', 'api', 'Feature request: Dark mode', 'Would love to see a dark mode option in the app!', 'customer3@example.com', 'Bob Wilson', 'positive', 0.8, 'feature_request', 'low', 'open', null, null, ARRAY['feature', 'ui']),
    ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440000', 'email', 'URGENT: System down!', 'Our entire team cannot access the platform. This is critical!', 'customer4@example.com', 'Alice Brown', 'very_negative', -0.9, 'technical', 'urgent', 'open', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', ARRAY['outage', 'critical'])
ON CONFLICT DO NOTHING;

-- Create demo templates
INSERT INTO templates (id, tenant_id, name, subject, body, category, tags, variables)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440000', 'Password Reset', 'Password Reset Instructions', 'Hello {{customer_name}},\n\nYou requested a password reset. Click the link below:\n\n{{reset_link}}\n\nIf you did not request this, please ignore this email.', 'technical', ARRAY['password', 'security'], '["customer_name", "reset_link"]'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440000', 'Refund Confirmation', 'Refund Processed', 'Hi {{customer_name}},\n\nYour refund of {{amount}} has been processed and will appear in your account within 5-7 business days.', 'billing', ARRAY['refund', 'payment'], '["customer_name", "amount"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Create demo KB articles
INSERT INTO kb_articles (id, tenant_id, title, content, category, tags, is_published, published_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440000', 'How to Reset Your Password', 'To reset your password:\n\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Check your inbox for the reset link\n5. Create a new password', 'technical', ARRAY['password', 'login', 'account'], true, NOW()),
    ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440000', 'Understanding Your Invoice', 'Your invoice includes:\n\n- Subscription fee\n- Usage charges\n- Tax (if applicable)\n\nPayment is due within 30 days.', 'billing', ARRAY['billing', 'payment', 'invoice'], true, NOW())
ON CONFLICT DO NOTHING;

EOF

    log_success "Demo data seeded successfully!"
}

# Seed production data
seed_production_data() {
    log_info "Seeding production data..."
    
    psql "$DATABASE_URL" << 'EOF'
-- Create system tenant
INSERT INTO tenants (id, name, slug, plan, settings)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'System',
    'system',
    'enterprise',
    '{"is_system": true}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Create system user
INSERT INTO users (id, tenant_id, email, first_name, last_name, role, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'system@ticketai.app', 'System', 'User', 'admin', true)
ON CONFLICT DO NOTHING;

EOF

    log_success "Production data seeded successfully!"
}

# Main seeding flow
main() {
    echo ""
    echo "=========================================="
    echo "  🌱 TicketAI Database Seeding"
    echo "=========================================="
    echo ""
    
    # Parse arguments
    MODE="demo"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production)
                MODE="production"
                shift
                ;;
            --demo)
                MODE="demo"
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --demo        Seed demo data (default)"
                echo "  --production  Seed production data only"
                echo "  --help        Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_database
    
    if [ "$MODE" = "production" ]; then
        seed_production_data
    else
        seed_demo_data
    fi
    
    echo ""
    echo "=========================================="
    log_success "🎉 Seeding Complete!"
    echo "=========================================="
    echo ""
    
    if [ "$MODE" = "demo" ]; then
        echo "Demo credentials:"
        echo "  Admin:  admin@demo.com"
        echo "  Agent:  agent1@demo.com"
        echo "  Manager: manager@demo.com"
        echo ""
    fi
}

# Run main function
main "$@"
