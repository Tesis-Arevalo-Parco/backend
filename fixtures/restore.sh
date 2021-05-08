#!/bin/bash

set -e

URI=${1:-${DATABASE_URI:-mongodb://localhost:27017}}

DUMP=$( cd ./fixtures/dump/smartrisk; pwd -P )
echo -e "Loading fixtures in database \n\n"
echo $URI
mongorestore $DUMP --uri $URI --db ${2:-smartrisk} --drop

echo -e "\n\n FINISHED LOADING FIXTURES!"
