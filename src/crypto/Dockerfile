FROM node:18

WORKDIR /usr/src/app

RUN apt-get update

COPY package*.json ./

RUN npm install ethers axios sync-request dotenv --legacy-peer-deps

RUN mkdir -p /root/.config/hardhat-nodejs && chmod -R 777 /root/.config

EXPOSE 8545

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
