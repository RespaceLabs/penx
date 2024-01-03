#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

# Function to check if PostgreSQL is ready
check_postgres() {
    until pg_isready -h "$host" -p 5432 -d penx -U user; do
        >&2 echo "Postgres is unavailable - sleeping"
        sleep 1
    done
}

check_postgres

>&2 echo "Postgres is up - executing command"
exec $cmd
