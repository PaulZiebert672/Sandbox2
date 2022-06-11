#!/bin/sh

# Check proxy connectivity

docker run --rm -it \
  -v ${PWD}/src:/usr/local/src \
  eclipse-temurin:11 \
  java /usr/local/src/ProxyTest4Moneta.java /usr/local/src/envelope.json
