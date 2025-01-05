import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

export async function interactWithContract(contractAddress, player1, score1, player2, score2) {
    // Connect to the local blockchain
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Get the first account as the signer
    const signer = provider.getSigner(0); // Using the first account provided by Hardhat

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
        // Fetch current match details
        console.log("Fetching match details...");
        const matchDetails = await scoreContract.getMatch();
        console.log("Match details:", matchDetails);
    } catch (error) {
        console.error("Error calling getMatch:", error.message);
    }

    try {
        // Submit match data to the contract
        console.log("Submitting match data...");
        const tx = await scoreContract.setMatch(player1, score1, player2, score2);
        console.log("Transaction submitted. Waiting for confirmation...");
        await tx.wait();
        console.log("Match data submitted successfully.");
    } catch (error) {
        console.error("Error submitting match data:", error.message);
    }
}
