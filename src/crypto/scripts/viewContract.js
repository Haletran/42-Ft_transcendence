const { ethers } = require("hardhat");

async function main() {
    // Connect to the provider (Hardhat local node, or external network)
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Get the signer (the first account from the local Hardhat node)
    const signer = provider.getSigner();

    // Replace with the actual deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

    // Function to view the current state of the contract
    async function viewContractState() {
        try {
            const matchDetails = await scoreContract.getMatch();
            console.log("Contract State:");
            console.log("Player 1:", matchDetails[0], "Score 1:", matchDetails[1].toString());
            console.log("Player 2:", matchDetails[2], "Score 2:", matchDetails[3].toString());
        } catch (error) {
            console.error("Error viewing contract state:", error);
        }
    }

    // Call the viewContractState function
    await viewContractState();

    // Example of submitting match data
    try {
        const tx = await scoreContract.setMatch("Player1", 10, "Player2", 20);
        await tx.wait();
        console.log("Match data submitted successfully.");
    } catch (error) {
        console.error("Error submitting match data:", error);
    }

    // View updated contract state
    await viewContractState();
}

// Run the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main function:", error);
        process.exit(1);
    });
