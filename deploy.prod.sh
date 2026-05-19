#!/bin/bash
set -e

echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Deployment completed successfully!"
docker compose -f docker-compose.prod.yml ps