FROM python:3.10-slim

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y openssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/django.key -out /etc/ssl/certs/django.crt -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=ft_transcendence.com"

EXPOSE 9000
