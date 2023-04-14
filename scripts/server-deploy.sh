#!/bin/bash

set -e # Exit immediately if any command exits with a non-zero status code

# change it to your project name (it needs to load your image)
PROJECT="manage-cost"
export PROJECT

DOCKER_DIR="./docker"

cd "$DOCKER_DIR"

# Load variables from .env file
source ./.env

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

docker compose pull

# run docker-compose up command
docker compose up -d --build
