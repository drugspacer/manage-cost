#!/bin/bash

set -e # Exit immediately if any command exits with a non-zero status code

source "$(dirname "$0")"/common.sh

DOCKER_DIR="$SCRIPT_DIR/../docker"

cd "$DOCKER_DIR"

# run docker-compose up command
docker-compose up
