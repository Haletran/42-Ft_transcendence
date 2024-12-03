FROM debian:bullseye-slim

RUN apt-get update && apt-get upgrade -y && \
    apt-get install nginx openssl -y

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]