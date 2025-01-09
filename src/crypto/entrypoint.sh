#!/bin/sh

sleep 20
# Start Hardhat node in the background
nohup npx hardhat node &

# Wait for Hardhat node to fully start (adjust sleep time as necessary)
sleep 20

# Run your deploy command
npx hardhat run scripts/deploy.js --network localhost

# Keep the container running
tail -f /dev/null