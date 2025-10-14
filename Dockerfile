# Build stage
FROM rust:1.85-alpine AS builder

# Install build dependencies
RUN apk add --no-cache musl-dev sqlite-dev

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

# Install runtime dependencies
RUN apk add --no-cache sqlite-libs libgcc

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/stoic-wisdom-api /app/stoic-wisdom-api

# Copy migrations
COPY --from=builder /app/migrations /app/migrations

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Set environment variables
ENV DATABASE_URL=sqlite:/app/data/stoic_wisdom.db
ENV PORT=3000
ENV RUST_LOG=info

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
