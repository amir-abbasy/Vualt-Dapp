# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```



Objective:
Develop a backend service using Node.js to interact with deployed smart contracts, listen for
events, and trigger transactions through Metamask.
Detailed Requirements:
1. Deploy a Simple Vault Contract:
● Create a Solidity smart contract Vault that:
● Allows users to deposit BNB and withdraw BNB.
● Emits events on Deposit and Withdrawal.
● Include access control to allow only specific addresses to perform withdrawals (e.g., contract owner).
2. Set Up Backend Service with Node.js:
● Create a Node.js backend to:
● Listen for Deposit and Withdrawal events from the Vault contract.
●  Notify users in real time (via console or frontend notification).
○ Interact with the deployed contract and trigger a withdrawal transaction when the withdrawal conditions are met.
3. Frontend Interface:
● Build a simple frontend interface with the following features:
● Metamask integration for users to connect their wallets.
●  Deposit BNB into the Vault contract through the frontend.
●  Withdraw BNB (only if they are the owner) via Metamask.

4. Testing and Debugging:
● Write integration tests to:
● Verify event emissions when deposits and withdrawals are made.
● Ensure proper handling of contract ownership and access control.

5. Deliverables:
● GitHub repository containing:
● Vault smart contract code.
○ Node.js backend code with instructions on how to run the service.
○ Frontend code with setup instructions.
● Deployed contract address and transaction hashes for testnet deployment.