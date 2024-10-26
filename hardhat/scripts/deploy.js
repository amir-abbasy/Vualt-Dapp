const hre = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Vault = await hre.ethers.getContractFactory("Vault");
    const contract = await Vault.deploy();
    // await contract.deployed(); // Wait for deployment to complete

    console.log("Contract deployed to:", contract.address);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main();
