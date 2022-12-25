#!/bin/bash

# This file was shamelessly copied from https://github.com/mrts/docker-postgresql-multiple-databases
# Used for creating multiple database in one Postgres docker image.
set -e
set -u

function create_user_and_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE USER $database;
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
}

create_user_and_database "${DB_NAME}"
