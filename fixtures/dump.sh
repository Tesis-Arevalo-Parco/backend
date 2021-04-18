#!/bin/bash

set -e

echo "Copying dump..."

URI=${1:-${DB_DEVELOPMENT_URI:-mongodb://localhost:27017}}

rm -fr ./fixtures/dump

mongodump -d backend --out ./fixtures/dump

pwd -P

echo "DONE !"
