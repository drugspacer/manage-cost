#!/bin/bash

source "$(dirname "$0")"/common.sh

if [ ! -d "$CERTS_DIR" ]; then
  mkdir -p "$CERTS_DIR"
fi

#generating private and public keys for jwt token
openssl genrsa -out "$CERTS_DIR/keypair.pem" 2048
openssl rsa -in "$CERTS_DIR/keypair.pem" -pubout -out "$CERTS_DIR/public.pem"
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in "$CERTS_DIR/keypair.pem" -out "$CERTS_DIR/private.pem"
rm "$CERTS_DIR/keypair.pem"
