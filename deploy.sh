#!/bin/bash

# Simple Cloud Build deployment script for libpostal-api
# This script uses the cloudbuild.yaml configuration for deployment

set -e

# Configuration
PROJECT_ID="${PROJECT_ID:-libpostal-api}"
REGION="${REGION:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/libpostal-api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Building Docker image locally..."
log_info "Project: $PROJECT_ID"
log_info "Image: $IMAGE_NAME"

# Build Docker image locally
docker build -t "$IMAGE_NAME" .

log_info "Pushing image to Google Container Registry..."

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker --quiet

# Push the image
docker push "$IMAGE_NAME"

log_info "Deploying to Cloud Run..."

# Deploy to Cloud Run
gcloud run deploy libpostal-api \
    --image="$IMAGE_NAME" \
    --platform=managed \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --memory=3Gi \
    --cpu=1 \
    --max-instances=10 \
    --min-instances=0 \
    --concurrency=500 \
    --timeout=900 \
    --allow-unauthenticated \
    --set-env-vars=RUST_LOG=info \
    --execution-environment=gen2

log_info "Deployment completed! 🚀"

# Get service URL
SERVICE_URL=$(gcloud run services describe libpostal-api \
    --platform=managed \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --format="value(status.url)")

log_info "Service URL: $SERVICE_URL"
log_info "Health check: $SERVICE_URL/api/v1/health"
