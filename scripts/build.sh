#!/bin/bash

set -e # Exit immediately if any command exits with a non-zero status code

source "$(dirname "$0")"/common.sh

# Parse command line arguments
#while getopts u:p: option
#do
#    case "${option}" in
#        u) USERNAME=${OPTARG};;
#        p) PASSWORD=${OPTARG};;
#        *) error "Invalid option: -$OPTARG";;
#    esac
#done

# Load variables from .env file
source "$SCRIPT_DIR"/../docker/.env

# Check if required variables are set
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ]; then
    error "Required options not provided. (DOCKER_USERNAME, DOCKER_PASSWORD). Check .env file."
fi

# Check if the certs directory exists and contains files
if [ -d "$CERTS_DIR" ] && [ "$(ls -A "$CERTS_DIR")" ]
then
    echoWrapper "green" "Using existing certs directory."
else
    echoWrapper "green" "Generating new certs directory..."
    source "$SCRIPT_DIR"/generate-jwt-keypair.sh
fi

# Build the Maven project
echoWrapper "green" "Building project..."
$MVNW_PATH clean package

echoWrapper "green" "ARTIFACT:VERSION=$PROJECT:$VERSION"

#build and push application image to docker.io
echoWrapper "green" "Building image..."
docker build -f "$SCRIPT_DIR"/../docker/Dockerfile -t "$PROJECT" --build-arg PROJECT="$PROJECT" "$SCRIPT_DIR"/..
docker tag "$PROJECT" "$DOCKER_USERNAME"/"$PROJECT":"$VERSION"
docker tag "$PROJECT" "$DOCKER_USERNAME"/"$PROJECT":latest
echoWrapper "green" "Pushing images..."
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker push "$DOCKER_USERNAME"/"$PROJECT":"$VERSION"
docker push "$DOCKER_USERNAME"/"$PROJECT":latest
