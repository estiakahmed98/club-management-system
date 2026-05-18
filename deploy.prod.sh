#!/bin/bash
set -e

echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

echo "Starting Backend..."
docker compose -f docker-compose.prod.yml up -d --build app

echo "Deployment completed successfully!"
docker compose -f docker-compose.prod.yml ps