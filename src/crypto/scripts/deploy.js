async function main() {
    // Connect to the local Hardhat node
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    
    // Use the first account (signer) available in the local Hardhat node
    const signer = provider.getSigner();
    
    console.log("Deploying contracts with the account:", await signer.getAddress());

    // Get the contract factory for your SimpleScoreContract
    const ScoreContract = await ethers.getContractFactory("SimpleScoreContract", signer);
    
    // Deploy the contract
    console.log("Deploying contract...");
    const scoreContract = await ScoreContract.deploy();
    
    console.log("Contract deployed to:", scoreContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
