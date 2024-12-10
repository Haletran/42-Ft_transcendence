# Use an official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install project dependencies (including hardhat-related packages)
RUN npm install --legacy-peer-deps

# Copy the rest of your project files into the container
COPY . .

# Create the Hardhat config directory and set permissions
RUN mkdir -p /root/.config/hardhat-nodejs && chmod -R 777 /root/.config

# Expose a port for Hardhat's local blockchain
EXPOSE 8545

# Command to start Hardhat (use npx to run Hardhat)
CMD ["npx", "hardhat", "node"]
