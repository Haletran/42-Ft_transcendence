#!/bin/bash

if [ -f ".env" ]; then
    echo "File .env already exists"
    echo "Here is what's inside:"
    cat .env
    exit 1
fi

echo "Setting up the environment variables for the project"

read -p "Enter the name of the database: " POSTGRES_DB
read -p "Enter the name of the user: " POSTGRES_USER
read -p "Enter the password for the user: " POSTGRES_PASSWORD
read -p "Enter the port for the database: " POSTGRES_PORT
read -p "Enter the host for the database: " POSTGRES_HOST

read -p "Enter the host for the Django database: " DJANGO_DB_HOST
read -p "Enter the port for the Django database: " DJANGO_DB_PORT
read -p "Enter the name of the Django database: " DJANGO_DB_NAME

read -p "Enter the name of the Django user: " DJANGO_DB_USER
read -p "Enter the password for the Django user: " DJANGO

read -p "Enter the port for the Prometheus database: " PROMETHEUS_PORT
read -p "Enter the user for the Prometheus database: " PROMETHEUS_USER
read -p "Enter the password for the Prometheus database: " PROMETHEUS_PASSWORD

read -p "Enter the port for the Grafana database: " GRAFANA_PORT
read -p "Enter the user for the Grafana database: " GRAFANA_USER
read -p "Enter the password for the Grafana database: " GRAFANA_PASSWORD

read -p "Enter the port for the Portainer database: " PORTAINER_PORT
read -p "Enter the user for the Portainer database: " PORTAINER_USER
read -p "Enter the password for the Portainer database: " PORTAINER_PASSWORD

read -p "Enter the UID for the API42: " API42_UID
read -p "Enter the password for the API42: " API42_PASS


echo "POSTGRES_DB=$POSTGRES_DB" >> .env
echo "POSTGRES_USER=$POSTGRES_USER" >> .env
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
echo "POSTGRES_PORT=$POSTGRES_PORT" >> .env
echo "POSTGRES_HOST=$POSTGRES_HOST" >> .env

echo "DJANGO_DB_HOST=$DJANGO_DB_HOST" >> .env
echo "DJANGO_DB_PORT=$DJANGO_DB_PORT" >> .env
echo "DJANGO_DB_NAME=$DJANGO_DB_NAME" >> .env
echo "DJANGO_DB_USER=$DJANGO_DB_USER" >> .env
echo "DJANGO_DB_PASSWORD=$DJANGO_DB_PASSWORD" >> .env

echo "PROMETHEUS_PORT=$PROMETHEUS_PORT" >> .env
echo "PROMETHEUS_USER=$PROMETHEUS_USER" >> .env
echo "PROMETHEUS_PASSWORD=$PROMETHEUS_PASSWORD" >> .env

echo "GRAFANA_PORT=$GRAFANA_PORT" >> .env
echo "GRAFANA_USER=$GRAFANA_USER" >> .env
echo "GRAFANA_PASSWORD=$GRAFANA_PASSWORD" >> .env

echo "PORTAINER_PORT=$PORTAINER_PORT" >> .env
echo "PORTAINER_USER=$PORTAINER_USER" >> .env
echo "PORTAINER_PASSWORD=$PORTAINER_PASSWORD" >> .env

echo "API42_UID=$API42_UID" >> .env
echo "API42_PASS=$API42_PASS" >> .env
