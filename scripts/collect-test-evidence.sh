#!/bin/bash

# Comprehensive Test Evidence Collection Script
# Runs all tests and captures evidence for documentation

set -e

EVIDENCE_DIR="test-evidence"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "========================================="
echo "Test Evidence Collection"
echo "========================================="
echo "Timestamp: $TIMESTAMP"
echo "Evidence directory: $EVIDENCE_DIR"
echo ""

# Create evidence directory
mkdir -p "$EVIDENCE_DIR"
mkdir -p "$EVIDENCE_DIR/backend"
mkdir -p "$EVIDENCE_DIR/frontend"
mkdir -p "$EVIDENCE_DIR/e2e"
mkdir -p "$EVIDENCE_DIR/performance"

# Collect system information
echo "Collecting system information..."
{
    echo "=== System Information ==="
    echo "Date: $(date)"
    echo "OS: $(uname -s)"
    echo "Architecture: $(uname -m)"
    echo "Hostname: $(hostname)"
    echo ""
    echo "=== Rust Version ==="
    rustc --version
    cargo --version
    echo ""
    echo "=== Node Version ==="
    node --version
    npm --version
    echo ""
} > "$EVIDENCE_DIR/system-info.txt"

# Run backend unit tests
echo "Running backend unit tests..."
{
    echo "=== Backend Unit Tests ==="
    echo "Date: $(date)"
    echo ""
    cargo test --verbose 2>&1
} | tee "$EVIDENCE_DIR/backend/unit-tests.log"

# Run backend integration tests
echo "Running backend integration tests..."
{
    echo "=== Backend Integration Tests ==="
    echo "Date: $(date)"
    echo ""
    cargo test --test integration_tests --verbose 2>&1
} | tee "$EVIDENCE_DIR/backend/integration-tests.log"

# Build backend
echo "Building backend..."
{
    echo "=== Backend Build ==="
    echo "Date: $(date)"
    echo ""
    cargo build --release 2>&1
} | tee "$EVIDENCE_DIR/backend/build.log"

# Run linter
echo "Running clippy..."
{
    echo "=== Clippy Analysis ==="
    echo "Date: $(date)"
    echo ""
    cargo clippy --all-targets 2>&1 || true
} | tee "$EVIDENCE_DIR/backend/clippy.log"

# Build frontend
echo "Building frontend..."
cd frontend
{
    echo "=== Frontend Build ==="
    echo "Date: $(date)"
    echo ""
    npm run build 2>&1
} | tee "../$EVIDENCE_DIR/frontend/build.log"

cd ..

# Create summary report
{
    echo "# Test Evidence Report"
    echo ""
    echo "**Generated:** $(date)"
    echo ""
    echo "## Test Summary"
    echo ""
    echo "### Backend Tests"
    echo "- Unit Tests: See \`backend/unit-tests.log\`"
    echo "- Integration Tests: See \`backend/integration-tests.log\`"
    echo "- Build Status: See \`backend/build.log\`"
    echo "- Linter: See \`backend/clippy.log\`"
    echo ""
    echo "### Frontend"
    echo "- Build Status: See \`frontend/build.log\`"
    echo ""
    echo "## Files Generated"
    echo ""
    ls -lR "$EVIDENCE_DIR" | tail -n +2
    echo ""
} > "$EVIDENCE_DIR/SUMMARY.md"

echo ""
echo "========================================="
echo "Test evidence collection complete!"
echo "Evidence saved to: $EVIDENCE_DIR/"
echo "========================================="
