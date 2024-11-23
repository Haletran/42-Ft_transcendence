require("@nomiclabs/hardhat-ethers");
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

async function getVaultSecrets() {
  try {
    const response = await axios.get('http://vault:8200/v1/secret/data/metamask', {
      headers: {
        'X-Vault-Token': process.env.VAULT_TOKEN // Ensure VAULT_TOKEN is set in your environment
      }
    });
    const data = response.data.data.data;
    return {
      url: data.url,
      accounts: [data.account]
    };
  } catch (error) {
    console.error('Error fetching secrets from Vault:', error);
    return {
      url: 'l', // Provide a default URL or handle it as needed
      accounts: [''] // Provide a default account or handle it as needed
    };
  }
}

async function getConfig() {
  const vaultSecrets = await getVaultSecrets();

  return {
    solidity: "0.8.27",
    defaultNetwork: "sepolia",
    networks: {
      hardhat: {},
      sepolia: {
        url: vaultSecrets.url,
        accounts: vaultSecrets.accounts
      }
    }
  };
}

module.exports = (async () => {
  return await getConfig();
})();