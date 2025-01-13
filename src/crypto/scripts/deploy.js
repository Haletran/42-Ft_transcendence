const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function deployContract(index, signer) {
    const ScoreContract = await hre.ethers.getContractFactory("SimpleScoreContract", signer);

    console.log(`Deploying contract ${index}...`);
    const scoreContract = await ScoreContract.deploy();
    await scoreContract.deployed();

    console.log(`Contract ${index} deployed to:`, scoreContract.address);

    return scoreContract.address; // Return the contract address
}

async function main() {
    const provider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer = provider.getSigner();

    let allAddresses = {}; // Object to store all the contract addresses

    // Deploy contracts 1 through 7 and store their addresses
    for (let i = 1; i <= 7; i++) {
        const contractAddress = await deployContract(i, signer);
        allAddresses[`contract${i}`] = contractAddress; // Store address with the key `contract1`, `contract2`, etc.
    }

    // Format the addresses as an array of objects
    const formattedAddresses = [allAddresses];

    // Define the path to save the addresses
    const addressesDir = path.join(__dirname, '../contract_address/');
    const addressesPath = path.join(addressesDir, "deployedAddresses.json");

    // Create the directory if it does not exist
    if (!fs.existsSync(addressesDir)) {
        fs.mkdirSync(addressesDir, { recursive: true });
    }

    // Save all addresses to a single JSON file
    fs.writeFileSync(addressesPath, JSON.stringify(formattedAddresses, null, 2), "utf8");
    console.log(`All contract addresses saved to ${addressesPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });