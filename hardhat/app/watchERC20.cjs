require("dotenv").config(); // Load environment variables
const { Web3 } = require("web3"); // Import web3
const erc20abi = require("./abi/usdt.json"); // Import ABI JSON

// Live
// var WSS_ENDPOINT = "wss://ethereum-rpc.publicnode.com";
// var SMART_CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";


// Test B-USDT
var WSS_ENDPOINT = "wss://bsc-testnet-rpc.publicnode.com";
var SMART_CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";


0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48
// Workaround for JSON.stringify() event logs with BigInt values.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * Starts the smart contract event listener.
 * Websocket Provider config: https://docs.web3js.org/api/web3-providers-ws/class/WebSocketProvider
 * @param chain - Name of the blockchain network for logging purposes.
 * @param wssEndpoint - Websocket endpoint for the blockchain network.
 * @param contractAddress - Smart contract address.
 */
const startEventListener = async (chain, wssEndpoint, contractAddress) => {
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
  const contract = new web3.eth.Contract(erc20abi, contractAddress);
  await subscribeToEvent(chain, contract, "Transfer");
  await subscribeToEvent(chain, contract, "Approval");
};

/**
 * Subscribes to a smart contract event.
 * @param chain - Name of the blockchain network for logging purposes.
 * @param contract - Smart contract address.
 * @param eventName - Name of the event to subscribe to.
 */
const subscribeToEvent = async (chain, contract, eventName) => {
  const subscription = await contract.events[eventName]();

  subscription.on("connected", (subscriptionId) => {
    console.log(`${chain} USDT '${eventName}' SubID:`, subscriptionId);
  });

  subscription.on("data", (event) => {
    console.log(`${chain} USDT '${eventName}'`, JSON.stringify({ event })); // Handle BigInt logging
  });

  subscription.on("changed", (event) => {
    // Remove event from local database
  });

  subscription.on("error", (error) => {
    console.error(`${chain} USDT '${eventName}' error:`, error);
  });
};

/*
  Start smart contract event listeners

  Chains:
    - Ethereum
*/


startEventListener("Ethereum", WSS_ENDPOINT,  SMART_CONTRACT_ADDRESS);
