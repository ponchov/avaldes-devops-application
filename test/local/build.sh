#!/bin/sh

set -e

deleteStack() {
  echo "===> Deleting Docker compose stack..."
  docker-compose down
}

echo "===> Building docker-compose in order to start tests"
docker-compose up -d --force-recreate --build
echo "===> Wait 5 seconds till NodeApp get running properly"
sleep 7

if [ ! -z "$nodeapp" ]; then
  echo "==> Failed, docker image is not working properly"
  docker logs ${nodeapp}
fi

echo "===> Running 'npm run migrate-up' to create DB scheme"
nodeapp=$(docker ps | grep nodeapp | awk '{print $1}')

docker exec $nodeapp npm run migrate-up

echo "===> Local Testing if it worls properly"
getUsers=$(curl -s -o /dev/null -w '%{http_code}' localhost:3091/users)


if [ $getUsers -eq 200 ]; then
    echo "===> It worked perfectly !!!\nApp running "
else
    echo "===> Error: NodeApp is not working well. Status Code: $statusCode"
    deleteStack
    exit 10
fi

echo "===> Running UNIT tests"
docker exec $nodeapp npm test
