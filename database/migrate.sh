#!/bin/bash
# ============================================
# TicketAI Database Migration Runner
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MIGRATIONS_DIR="$(dirname "$0")/migrations"
DB_URL="${DATABASE_URL:-}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DATABASE_URL is set
check_database_url() {
    if [ -z "$DB_URL" ]; then
        log_error "DATABASE_URL environment variable is not set"
        echo "Please set DATABASE_URL before running migrations"
        exit 1
    fi
    log_info "Database URL configured"
}

# Create migrations tracking table if not exists
create_migrations_table() {
    log_info "Creating migrations tracking table if needed..."
    psql "$DB_URL" -c "
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            migration_name VARCHAR(255) UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT NOW()
        );
    " 2>/dev/null || {
        log_error "Failed to connect to database. Please check your DATABASE_URL"
        exit 1
    }
    log_info "Migrations table ready"
}

# Get list of applied migrations
get_applied_migrations() {
    psql "$DB_URL" -t -c "SELECT migration_name FROM schema_migrations ORDER BY id;" 2>/dev/null | xargs || echo ""
}

# Apply a single migration
apply_migration() {
    local file="$1"
    local filename=$(basename "$file")
    
    log_info "Applying migration: $filename"
    
    if psql "$DB_URL" -f "$file" > /dev/null 2>&1; then
        psql "$DB_URL" -c "INSERT INTO schema_migrations (migration_name) VALUES ('$filename');" > /dev/null 2>&1
        log_info "✅ Migration applied successfully: $filename"
    else
        log_error "❌ Failed to apply migration: $filename"
        exit 1
    fi
}

# Run all pending migrations
run_migrations() {
    log_info "Starting database migrations..."
    
    local applied=$(get_applied_migrations)
    local pending_count=0
    
    for file in "$MIGRATIONS_DIR"/*.sql; do
        [ -e "$file" ] || continue
        
        local filename=$(basename "$file")
        
        if echo "$applied" | grep -q "$filename"; then
            log_info "Skipping (already applied): $filename"
        else
            apply_migration "$file"
            ((pending_count++))
        fi
    done
    
    if [ $pending_count -eq 0 ]; then
        log_info "No pending migrations found"
    else
        log_info "Applied $pending_count migration(s)"
    fi
}

# Rollback last migration
rollback() {
    log_warn "Rollback functionality not yet implemented"
    log_warn "Please manually revert changes if needed"
}

# Reset database (DANGER!)
reset() {
    log_warn "⚠️  This will DELETE ALL DATA in the database!"
    read -p "Are you sure? Type 'yes' to continue: " confirm
    
    if [ "$confirm" = "yes" ]; then
        log_info "Dropping all tables..."
        psql "$DB_URL" -c "
            DO \$\$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END \$\$;
        " 2>/dev/null || true
        log_info "Database reset complete"
    else
        log_info "Reset cancelled"
    fi
}

# Show status
status() {
    log_info "Migration Status:"
    echo ""
    
    local applied=$(get_applied_migrations)
    
    echo "Applied migrations:"
    if [ -z "$applied" ]; then
        echo "  (none)"
    else
        for migration in $applied; do
            echo "  ✓ $migration"
        done
    fi
    
    echo ""
    echo "Pending migrations:"
    local has_pending=false
    for file in "$MIGRATIONS_DIR"/*.sql; do
        [ -e "$file" ] || continue
        local filename=$(basename "$file")
        if ! echo "$applied" | grep -q "$filename"; then
            echo "  ○ $filename"
            has_pending=true
        fi
    done
    
    if [ "$has_pending" = false ]; then
        echo "  (none)"
    fi
}

# Main
main() {
    case "${1:-migrate}" in
        migrate)
            check_database_url
            create_migrations_table
            run_migrations
            ;;
        status)
            check_database_url
            status
            ;;
        rollback)
            check_database_url
            rollback
            ;;
        reset)
            check_database_url
            reset
            ;;
        *)
            echo "Usage: $0 [migrate|status|rollback|reset]"
            echo ""
            echo "Commands:"
            echo "  migrate  - Run pending migrations (default)"
            echo "  status   - Show migration status"
            echo "  rollback - Rollback last migration"
            echo "  reset    - ⚠️  Drop all tables (DANGER!)"
            exit 1
            ;;
    esac
}

main "$@"
