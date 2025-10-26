# Build stage
FROM rust:1.85-alpine AS builder

# Install build dependencies (added postgresql-dev for PostgreSQL support)
RUN apk add --no-cache musl-dev sqlite-dev postgresql-dev

WORKDIR /app

# Copy manifests
COPY Cargo.toml ./

# Create a dummy main.rs to cache dependencies
RUN mkdir -p src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY src ./src
COPY migrations ./migrations

# Build the actual application
RUN touch src/main.rs && \
    cargo build --release

# Runtime stage
FROM alpine:3.21

# Install runtime dependencies (added libpq for PostgreSQL)
RUN apk add --no-cache sqlite-libs libgcc libpq

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/stoic-wisdom-api /app/stoic-wisdom-api

# Copy migrations
COPY --from=builder /app/migrations /app/migrations

# Prepare writable data directory for file-based SQLite (ephemeral per container lifecycle)
RUN mkdir -p /data && chmod 777 /data

# Set environment variables
ENV PORT=3000 \
    RUST_LOG=info \
    DATABASE_URL=sqlite:/data/stoic_wisdom.db

# Expose port
EXPOSE 3000

# Create startup script to handle database initialization
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Starting Stoic Wisdom API..."' >> /app/start.sh && \
    echo 'echo "Database will be created at: $DATABASE_URL"' >> /app/start.sh && \
    echo 'exec /app/stoic-wisdom-api' >> /app/start.sh && \
    chmod +x /app/start.sh

# Run the application via startup script
CMD ["/app/start.sh"]
