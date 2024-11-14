FROM python:3.11-slim

WORKDIR /app
COPY /dev_backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN rm -rf ./requirements.txt
COPY dev_backend/ .

EXPOSE 9000

