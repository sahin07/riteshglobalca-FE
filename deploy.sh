#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "Deploying ca-website..."

# Navigate to the website directory
cd /root/backend_deployment/ca-website

# Pull latest changes from main branch
echo "Pulling latest changes from main..."
git pull origin main

# Restart containers using Docker Compose
echo "Rebuilding and restarting Docker containers..."
docker compose down
docker compose up -d --build

echo "ca-website deployment completed successfully!"
