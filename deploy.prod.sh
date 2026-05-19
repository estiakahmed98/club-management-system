#!/bin/bash
set -e

echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

echo "Building containers without cache..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "Deployment completed successfully!"
docker compose -f docker-compose.prod.yml ps