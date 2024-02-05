#!/usr/bin/env bash

docker run -it --rm \
  --name node-reverse-proxy \
  -e APP_PORT=8080 \
  -e REQ_TARGET=http://books.enceladus.saturn.local:8083 \
  -p 16221:8080 \
  -d lab51trial/node-reverse-proxy:M1
