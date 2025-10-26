#!/bin/bash
# Migration script to transfer data from SQLite to PostgreSQL
# Usage: ./scripts/migrate_sqlite_to_postgres.sh <sqlite_db_path> <postgres_connection_string>

set -e

SQLITE_DB=${1:-"stoic_wisdom.db"}
POSTGRES_URL=${2:-$DATABASE_URL}

if [ -z "$POSTGRES_URL" ]; then
    echo "Error: PostgreSQL connection string required"
    echo "Usage: $0 <sqlite_db_path> <postgres_connection_string>"
    echo "Example: $0 stoic_wisdom.db postgres://user:pass@host:5432/dbname"
    exit 1
fi

echo "=== SQLite to PostgreSQL Migration ==="
echo "SQLite DB: $SQLITE_DB"
echo "PostgreSQL: ${POSTGRES_URL%%@*}@..." # Hide credentials in output
echo ""

# Check if SQLite database exists
if [ ! -f "$SQLITE_DB" ]; then
    echo "Error: SQLite database not found at $SQLITE_DB"
    exit 1
fi

# Install dependencies if not present
if ! command -v sqlite3 &> /dev/null; then
    echo "Installing sqlite3..."
    apk add --no-cache sqlite || apt-get install -y sqlite3 || brew install sqlite3
fi

if ! command -v psql &> /dev/null; then
    echo "Installing postgresql client..."
    apk add --no-cache postgresql-client || apt-get install -y postgresql-client || brew install postgresql
fi

echo "Step 1: Dumping data from SQLite..."
DUMP_FILE="/tmp/sqlite_dump_$$.sql"

# Export data from SQLite (as INSERT statements)
sqlite3 "$SQLITE_DB" << 'EOF' > "$DUMP_FILE"
.mode insert philosophers
SELECT * FROM philosophers;
.mode insert quotes
SELECT * FROM quotes;
.mode insert themes
SELECT * FROM themes;
.mode insert quote_themes
SELECT * FROM quote_themes;
.mode insert timeline
SELECT * FROM timeline;
.mode insert incidents
SELECT * FROM incidents;
EOF

echo "Step 2: Converting SQLite dump to PostgreSQL format..."
POSTGRES_DUMP="/tmp/postgres_dump_$$.sql"

# Convert SQLite INSERT syntax to PostgreSQL
# Replace single quotes in INSERT statements and handle AUTOINCREMENT -> SERIAL mapping
sed -e "s/INSERT INTO \([^ ]*\) VALUES/INSERT INTO \1 VALUES/g" \
    -e "s/''/\\\\'/g" \
    "$DUMP_FILE" > "$POSTGRES_DUMP"

# Add sequence resets at the end
cat >> "$POSTGRES_DUMP" << 'EOF'

-- Reset sequences to match the data
SELECT setval('philosophers_id_seq', (SELECT MAX(id) FROM philosophers));
SELECT setval('quotes_id_seq', (SELECT MAX(id) FROM quotes));
SELECT setval('themes_id_seq', (SELECT MAX(id) FROM themes));
SELECT setval('timeline_id_seq', (SELECT MAX(id) FROM timeline));
SELECT setval('incidents_id_seq', (SELECT MAX(id) FROM incidents));
EOF

echo "Step 3: Importing data into PostgreSQL..."
psql "$POSTGRES_URL" -f "$POSTGRES_DUMP"

echo "Step 4: Verifying migration..."
psql "$POSTGRES_URL" -c "SELECT 'Philosophers: ' || COUNT(*) FROM philosophers;"
psql "$POSTGRES_URL" -c "SELECT 'Quotes: ' || COUNT(*) FROM quotes;"
psql "$POSTGRES_URL" -c "SELECT 'Themes: ' || COUNT(*) FROM themes;"
psql "$POSTGRES_URL" -c "SELECT 'Timeline Events: ' || COUNT(*) FROM timeline;"
psql "$POSTGRES_URL" -c "SELECT 'Incidents: ' || COUNT(*) FROM incidents;"

# Cleanup
rm -f "$DUMP_FILE" "$POSTGRES_DUMP"

echo ""
echo "=== Migration Complete ==="
echo "Your data has been successfully migrated from SQLite to PostgreSQL"
