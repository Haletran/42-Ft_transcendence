require("@nomiclabs/hardhat-ethers");
const { ethers } = require('ethers');
const request = require('sync-request');
require('dotenv').config(); // Load environment variables from .env file

function getVaultSecrets() {
  try {
    const res = request('GET', 'http://vault_container:8200/v1/secret/data/metamask', {
      headers: {
        'X-Vault-Token': process.env.VAULT_TOKEN // Ensure VAULT_TOKEN is set in your environment
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
      accounts: [
        '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'  // Correct format: array of private keys
      ]
    }
  }
};

console.log('Hardhat Config:', config);

module.exports = config;