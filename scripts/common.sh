#!/bin/bash

# Define echoWrapper function for nice output
function echoWrapper {
  local COLOR=$1
  local MESSAGE=$2
  local RESET='\033[0m'

  case $COLOR in
    green)
      local CODE='\033[0;32m'
      ;;
    red)
      local CODE='\033[0;31m'
      ;;
    *)
      local CODE=''
      ;;
  esac

  echo -e "${CODE}${MESSAGE}${RESET}"
}

# Display error messages in red color and exit
function error {
  echoWrapper "red" "Error: $1" >&2
  exit 1
}

SCRIPT_DIR=$(dirname "$0")
export SCRIPT_DIR

CERTS_DIR="$SCRIPT_DIR/../src/main/resources/certs"
export CERTS_DIR

MVNW_PATH="$SCRIPT_DIR/../mvnw"
export MVNW_PATH

# Get the project name and version from the pom.xml file
PROJECT=$($MVNW_PATH help:evaluate -Dexpression=project.artifactId -q -DforceStdout)
export PROJECT

VERSION=$($MVNW_PATH help:evaluate -Dexpression=project.version -q -DforceStdout)
export VERSION
