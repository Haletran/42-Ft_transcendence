const { ethers } = require("hardhat");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        "http://127.0.0.1:8545"
    );

    const signer = provider.getSigner();
    const contractAddress = await askQuestion("Enter the contract address: ");
    const abi = [
        {
            inputs: [],
            name: "getMatch",
            outputs: [
                { internalType: "string", name: "", type: "string" },
                { internalType: "uint256", name: "", type: "uint256" },
                { internalType: "string", name: "", type: "string" },
                { internalType: "uint256", name: "", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    const scoreContract = new ethers.Contract(
        contractAddress,
        abi,
        signer
    );

    async function viewContractState() {
        try {
            const matchDetails = await scoreContract.getMatch();
            //console.log("Contract State:");
            console.log("Player 1:", matchDetails[0], "Score 1:", matchDetails[1].toString());
            console.log("Player 2:", matchDetails[2], "Score 2:", matchDetails[3].toString());
        } catch (error) {
            console.error("Error viewing contract state:", error);
        }
    }

    await viewContractState();
    rl.close();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main function:", error);
        process.exit(1);
    });
