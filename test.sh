#!/usr/bin/env bash

docker-compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  -f docker-compose.test.yml \
  up --no-deps --abort-on-container-exit db api
