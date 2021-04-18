#!/bin/bash

COUNTER=0
while !(pgrep mongo) && [[ $COUNTER -lt 10 ]] ; do
    sleep 2
    let COUNTER+=2
    echo "Waiting for mongo to initialize... ($COUNTER seconds so far)"
done

if !(pgrep mongo) ; then
    echo "Error to connect with database, please check logs of docker"
    exit 1
fi

npm run load_fixtures
