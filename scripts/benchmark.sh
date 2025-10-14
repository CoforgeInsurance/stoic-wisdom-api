#!/bin/bash

# Performance Testing Script for Stoic Wisdom API
# This script measures response times for all endpoints to verify < 50ms target

set -e

API_URL="${API_URL:-http://localhost:3000}"
ITERATIONS="${ITERATIONS:-10}"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Stoic Wisdom API Performance Test ===${NC}"
echo "API URL: $API_URL"
echo "Iterations: $ITERATIONS"
echo ""

# Function to measure endpoint performance
measure_endpoint() {
    local name=$1
    local endpoint=$2
    local total=0
    local max=0
    local min=999999
    
    echo -n "Testing $name... "
    
    for i in $(seq 1 $ITERATIONS); do
        # Measure time in milliseconds
        time=$(curl -o /dev/null -s -w '%{time_total}\n' "$API_URL$endpoint")
        # Convert to milliseconds
        time_ms=$(echo "$time * 1000" | bc)
        time_ms_int=${time_ms%.*}
        
        total=$((total + time_ms_int))
        
        if [ $time_ms_int -gt $max ]; then
            max=$time_ms_int
        fi
        
        if [ $time_ms_int -lt $min ]; then
            min=$time_ms_int
        fi
    done
    
    avg=$((total / ITERATIONS))
    
    # Color code based on performance
    if [ $avg -lt 50 ]; then
        color=$GREEN
        status="✓"
    elif [ $avg -lt 100 ]; then
        color=$YELLOW
        status="!"
    else
        color=$RED
        status="✗"
    fi
    
    echo -e "${color}${status} Avg: ${avg}ms, Min: ${min}ms, Max: ${max}ms${NC}"
}

echo "=== Endpoint Performance ==="
echo ""

# Health check
measure_endpoint "Health Check              " "/health"

# Philosophers
measure_endpoint "List Philosophers         " "/philosophers"
measure_endpoint "Get Philosopher           " "/philosophers/1"
measure_endpoint "Philosopher with Quotes   " "/philosophers/1/quotes"

# Quotes
measure_endpoint "List All Quotes           " "/quotes"
measure_endpoint "Random Quote              " "/quotes/random"
measure_endpoint "Daily Quote               " "/quotes/daily"
measure_endpoint "Filter by Theme           " "/quotes?theme=Dichotomy"
measure_endpoint "Filter by Philosopher     " "/quotes?philosopher=Marcus"
measure_endpoint "Search Quotes             " "/quotes?search=control"

# Themes
measure_endpoint "List Themes               " "/themes"
measure_endpoint "Get Theme                 " "/themes/1"

# Timeline
measure_endpoint "Get Timeline              " "/timeline"

# Incidents
measure_endpoint "List Incidents            " "/incidents"
measure_endpoint "Get Incident              " "/incidents/1"

echo ""
echo -e "${GREEN}=== Performance Summary ===${NC}"
echo "Target: < 50ms response time"
echo "✓ = Within target (< 50ms)"
echo "! = Acceptable (50-100ms)"
echo "✗ = Needs optimization (> 100ms)"
