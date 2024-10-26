require("dotenv").config(); // Load environment variables
const { Web3 } = require("web3"); // Import web3
// const vault_abi = require("./abi/usdt.json"); // Import ABI JSON
const vault_abi = require("./abi/vault.json"); // Import ABI JSON

// const adminPrivateKey =  "0xf309a339e9123251c37c3278b76c13eef4c9630b8905e553b4e0f4d3b74315be";
// const   = "wss://bsc-rpc.publicnode.com";
// const BSC_SMART_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

// wss bsc-testnet
const BSC_WSS_ENDPOINT = "wss://bsc-testnet-rpc.publicnode.com";
// const BSC_WSS_ENDPOINT = "wss://go.getblock.io/8ba8ef43ea1b47e0a5c1d6768c0ccdc1";
const VAULT_CONTRACT_ADDRESS = "0x280DC676FE9C5e1f220Eab5339919c43258DC495";

// Workaround for JSON.stringify() event logs with BigInt values.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const startEventListener = async (chain, wssEndpoint, contractAddress) => {
  console.log(`\n Vault Contract Event Listener Started \n`);

  const provider = new Web3.providers.WebsocketProvider(wssEndpoint, {
    autoReconnect: true,
    delay: 10000, // Default: 5000 ms
    maxAttempts: 10, // Default: 5
  });

  provider.on("connect", () => {
    console.log(`Connected to ${chain} websocket provider`);
  });

  provider.on("disconnect", (error) => {
    console.error(`Closed ${chain} webSocket connection`, error);
  });

  const web3 = new Web3(provider);

  // Smart contract event listeners
  const contract = new web3.eth.Contract(vault_abi, contractAddress);
  await subscribeToEvent(chain, contract, "Deposit");
  await subscribeToEvent(chain, contract, "Withdrawal");

};

const subscribeToEvent = async (chain, contract, eventName) => {
  const subscription = await contract.events[eventName]();

  subscription.on("connected", (subscriptionId) => {
    console.log(`${chain} VAULT '${eventName}' SubID:`, subscriptionId);
  });

  subscription.on("data", (event) => {
    console.log(`\n\n\n${chain} VAULT '${eventName}'`, JSON.stringify({ event })); // Handle BigInt logging
  });

  subscription.on("changed", (event) => {
    // Remove event from local database
  });

  subscription.on("error", (error) => {
    console.error(`${chain} VAULT '${eventName}' error:`, error);
  });
};


startEventListener("BSC", BSC_WSS_ENDPOINT, VAULT_CONTRACT_ADDRESS);

