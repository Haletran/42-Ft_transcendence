// scripts/interact.js
async function main() {
    const [deployer] = await ethers.getSigners();
  
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.attach("0x4dac71a5764cb54fd88417fe1b666e286a2bb6aa");
  
    // Set a new value
    await myContract.setValue(42);
    console.log("Value set to 42");
  
    // Get the current value
    const value = await myContract.getValue();
    console.log("Current value:", value.toString());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });