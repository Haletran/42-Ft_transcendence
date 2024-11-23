# Use an official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install ethers axios dotenv --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Create the Hardhat config directory and set permissions
RUN mkdir -p /root/.config/hardhat-nodejs && chmod -R 777 /root/.config

# Expose a port if your Hardhat project requires one
EXPOSE 8545

# Command to start Hardhat (e.g., start a local blockchain)
CMD ["npx", "hardhat", "node"]