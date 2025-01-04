const { ethers } = require("hardhat");

async function interactWithContract(contractAddress, player1, score1, player2, score2) {
    // Connect to the provider (Hardhat local node, or external network)
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Get the signer (the first account from the local Hardhat node)
    const signer = provider.getSigner();

    // ABI of the contract
    const abi = [
        {
            "inputs": [],
            "name": "getMatch",
            "outputs": [
                { "internalType": "string", "name": "", "type": "string" },
                { "internalType": "uint256", "name": "", "type": "uint256" },
                { "internalType": "string", "name": "", "type": "string" },
                { "internalType": "uint256", "name": "", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "string", "name": "_player1", "type": "string" },
                { "internalType": "uint256", "name": "_score1", "type": "uint256" },
                { "internalType": "string", "name": "_player2", "type": "string" },
                { "internalType": "uint256", "name": "_score2", "type": "uint256" }
            ],
            "name": "setMatch",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Create contract instance
    const scoreContract = new ethers.Contract(contractAddress, abi, signer);

    try {
        // Call the getMatch function to fetch the current match details
        const matchDetails = await scoreContract.getMatch();
        console.log("Match details:", matchDetails);
    } catch (error) {
        console.error("Error calling getMatch:", error);
    }

    try {
        // Submit match data to the contract
        const tx = await scoreContract.setMatch(player1, score1, player2, score2);
        await tx.wait();
        console.log("Match data submitted successfully.");
    } catch (error) {
        console.error("Error submitting match data:", error);
    }
}

// Export the function so it can be used in other files
module.exports = { interactWithContract };
