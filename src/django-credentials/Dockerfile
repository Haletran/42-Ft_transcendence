FROM python:3.10-slim

WORKDIR /app

COPY ../requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN pip install gunicorn
RUN pip install psycopg2-binary

EXPOSE 9000

CMD ["gunicorn", "--certfile=/etc/ssl/certs/django.crt", "--keyfile=/etc/ssl/private/django.key", "--bind", "0.0.0.0:9000", "credentials.wsgi:application"]
