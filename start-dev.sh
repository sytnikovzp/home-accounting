#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################


started_at=$(date +"%s")

echo "---------> Provisioning containers"
docker compose -f docker-compose-dev.yaml --env-file ./server/.env up -d
echo ""

# Run Sequalize's migrations.
echo "---------> Running application migrations"
docker exec -it backend-dev npx sequelize db:migrate
echo ""

# Run Sequalize's seeds.
echo "---------> Running application seeds"
docker exec -it backend-dev npx sequelize db:seed:all
echo "<--------- Seeds created"

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "---------> Done in ${minutes} m ${seconds} s"