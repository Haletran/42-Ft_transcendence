async function main() {
	// Get the Hardhat Runtime Environment
	const [deployer] = await ethers.getSigners();
  
	console.log("Deploying contracts with the account:", deployer.address);
  
	// Get the contract factory for MyContract
	const MyContract = await ethers.getContractFactory("MyContract");
  
	// Deploy the contract with a constructor argument
	const myContract = await MyContract.deploy("Hello, Hardhat!");
	console.log("MyContract deployed to:", myContract.address);
  }
  
  main()
	.then(() => process.exit(0))
	.catch((error) => {
	  console.error(error);
	  process.exit(1);
	}); 