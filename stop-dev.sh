#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################


started_at=$(date +"%s")

echo "---------> Provisioning containers"
docker compose -f docker-compose-dev.yaml --env-file ./server/.env down
echo ""

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "---------> Done in ${minutes} m ${seconds} s"