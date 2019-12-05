#!/usr/bin/env bash

docker pull ravenos/nbuild
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
