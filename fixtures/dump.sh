#!/bin/bash

set -e

echo "Copying dump..."

URI=${1:-${DATABASE_URI:-mongodb://localhost:27017}}

rm -fr ./fixtures/dump

mongodump -d smartrisk --out ./fixtures/dump

pwd -P

echo "DONE !"
