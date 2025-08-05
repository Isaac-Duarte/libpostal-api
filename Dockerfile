# Multi-stage build for libpostal-api
FROM rust:1.88.0-slim AS builder

# Install Node.js repository and update package lists
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -

# Install all dependencies (Node.js and build tools)
RUN apt-get update && apt-get install -y \
    build-essential \
    autoconf \
    automake \
    libtool \
    libtool-bin \
    pkg-config \
    curl \
    libcurl4-openssl-dev \
    libssl-dev \
    nodejs \
    git \
    cmake \
    clang \
    libclang-dev \
    llvm-dev \
    && rm -rf /var/lib/apt/lists/*

# Verify libtool installation
RUN which libtool && libtool --version

# Set working directory
WORKDIR /app

# Copy all source files
COPY . .

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    libcurl4 \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -r -s /bin/false app

# Create app directory
WORKDIR /app

# Set environment variable for libpostal data directory
ENV LIBPOSTAL_DATA_DIR=/app/data

# Copy the binary from builder stage
COPY --from=builder /app/target/release/libpostal-api /app/
COPY --from=builder /app/static /app/static

# Create data directory and download libpostal data
RUN mkdir -p data && chown -R app:app /app

# Switch to app user
USER app

# Pre-initialize libpostal data during build
# This downloads and initializes all required libpostal models and data
RUN ./libpostal-api --init-only

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Run the application
CMD ["./libpostal-api"]
