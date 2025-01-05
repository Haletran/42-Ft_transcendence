const fs = require("fs");
const path = require("path");

async function deployContract(index, provider, signer) {
    const ScoreContract = await ethers.getContractFactory("SimpleScoreContract", signer);
    
    console.log(`Deploying contract ${index}...`);
    const scoreContract = await ScoreContract.deploy();
    await scoreContract.deployed();

    console.log(`Contract ${index} deployed to:`, scoreContract.address);

    return scoreContract.address; // Return the contract address
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer = provider.getSigner();
    
    let allAddresses = {}; // Object to store all the contract addresses

    // Deploy contracts 1 through 7 and store their addresses
    for (let i = 1; i <= 7; i++) {
        const contractAddress = await deployContract(i, provider, signer);
        allAddresses[`contract${i}`] = contractAddress; // Store address with the key `contract1`, `contract2`, etc.
    }

    // Save all addresses to a single JSON file
    const addressesPath = path.join('../reverseproxy/static-content/static/contract', "deployedAddresses.json");
    fs.writeFileSync(addressesPath, JSON.stringify(allAddresses, null, 2), "utf8");
    console.log(`All contract addresses saved to ${addressesPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
