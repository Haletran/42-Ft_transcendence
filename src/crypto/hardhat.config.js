require("@nomiclabs/hardhat-ethers");
const { ethers } = require('ethers');
const request = require('sync-request');
require('dotenv').config(); // Load environment variables from .env file

function getVaultSecrets() {
  try {
    const res = request('GET', 'http://localhost:8200/v1/secret/data/metamask', { // change this to vault_container for Docker
      headers: {
        // 'X-Vault-Token': '' // Ensure VAULT_TOKEN is set in your environment
      }
    });
    const data = JSON.parse(res.getBody('utf8')).data.data;
    console.log('Successfully connected with the secrets from Vault.');
    return {
      url: `https://sepolia.infura.io/v3/${data.infura}`,
      accounts: [data.key]
    };
  } catch (error) {
    console.error('Error fetching secrets from Vault:', error);
    return {
      url: '', // Provide a default URL or handle it as needed
      accounts: [''] // Provide a default account or handle it as needed
    };
  }
}

const vaultSecrets = getVaultSecrets();
console.log('Vault Secrets:', vaultSecrets);

const config = {
  solidity: "0.8.27",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: vaultSecrets.url,
      accounts: vaultSecrets.accounts,
      gasPrice: 1000000000, // 1 Gwei
      gas: 3000000, // 3 million units of gas
    }
  }
};

console.log('Hardhat Config:', config);

module.exports = config;