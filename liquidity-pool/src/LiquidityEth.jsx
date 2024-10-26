import { useState } from 'react';
import './App.css';
import { parseEther, parseUnits } from 'viem';
import token_abi from './abi/usdt.json';
import router_abi from './abi/router.json';

import { useAccount, useWriteContract } from 'wagmi';

function App() {

  // const routerAddress = "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3"; // PancakeSwap V2 Router (BSC Testnet)
  // const tokenAddress = "0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48"; // Your custom token address

  const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // PancakeSwap V2 Router (BSC Testnet)
  const tokenAddress = "0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48"; // Your custom token address

  const { writeContract, error } = useWriteContract();
  const { address } = useAccount();

  const amountToken = 100;
  const amountETH = 0.5;

  console.log({ error });

  // Approve PancakeSwap Router to spend your custom token
  const approveToken = async () => {
    try {
      const res = await writeContract({
        address: tokenAddress,
        abi: token_abi,
        functionName: 'approve',
        args: [routerAddress, parseUnits(amountToken.toString(), 18)], // For tokens, use parseUnits with the correct decimals
      });
      console.log('Approval Success:', res);
    } catch (error) {
      console.log('Approval Error:', error);
    }
  };

  const args = [
    tokenAddress, // The address of the token you're adding liquidity for
    parseUnits(amountToken.toString(), 18), // The amount of your custom token to add (with correct decimals)
    parseUnits((amountToken * 0.95).toString(), 18), // Minimum amount of token (with slippage tolerance)
    parseEther((amountETH * 0.95).toString()), // Minimum amount of ETH (with slippage tolerance)
    address, // Your wallet address (recipient of liquidity tokens)
    Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes deadline
  ]

  console.log(args, parseEther("1"));
  

  // Add Liquidity function
  const addLiquidity = async () => {
    try {
      const res = await writeContract({
        address: routerAddress,
        abi: router_abi,
        functionName: 'addLiquidityETH',
        args,
        overrides: {
          value: parseEther(amountETH.toString()), // The amount of ETH (T-BNB) to send with the transaction
        }
      });
      console.log('Add Liquidity Success:', res);
    } catch (error) {
      console.log('Add Liquidity Error:', error);
    }
  };

  return (
    <>
      <button onClick={approveToken}>Approve</button>
      <button onClick={addLiquidity}>Add Liquidity</button>
    </>
  );
}

export default App;
