const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Replace with your contract's ABI and deployed address
const contractAddress = process.env.CONTRACT_ADDRESS || '0x52eEE40f5D00c02AD25e344Db0Cc324a04031449';

// Fetch the ABI from the local file
function fetchABI() {
    const abiPath = path.join(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
    const data = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    return data.abi;
}

// Main function to interact with the contract
async function main() {
    // Connect to Ethereum using Infura or Alchemy
    const provider = new ethers.providers.InfuraProvider('sepolia', process.env.INFURA_PROJECT_ID || '61d1075ff12549fda15f68b38cf765ea');
    // Or using Alchemy
    // const provider = new ethers.providers.AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY);

    // Fetch the ABI
    const contractABI = fetchABI();

    // Create contract instance
    const myContract = new ethers.Contract(contractAddress, contractABI, provider);

    // Call the greeting function
    try {
        const greeting = await myContract.greeting();
        console.log('Greeting:', greeting);
    } catch (error) {
        console.error('Error fetching greeting:', error);
    }
}

// Call the main function
main();