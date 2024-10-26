import { useState } from 'react';
import './App.css';
import { parseUnits } from 'viem';
import usdt_abi from './abi/usdt.json';
import ggfc_abi from './abi/ggfc.json';
import router_abi from './abi/router.json';

import { useAccount, useWriteContract } from 'wagmi';

function App() {
  // PancakeSwap V2 Router on BSC Testnet
  const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
  const tokenA = "0x49bd7F51FC8e1eB0628Bb409E0A0A5cE034e2ACC"; // GGFC token address
  const tokenB = "0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48"; // USDT token address

  const { writeContract, error } = useWriteContract();
  const { address } = useAccount();

  const amountA = 1000; // GGFC
  const amountB = 100; // USDT

  console.log({ error });

  // Approve PancakeSwap Router to spend your custom token GGFC
  const approveGGFC = async () => {
    try {
      const res = await writeContract({
        address: tokenA,
        abi: ggfc_abi,
        functionName: 'approve',
        args: [routerAddress, parseUnits(amountA.toString(), 6)], // GGFC has 6 decimals
      });
      console.log('Approval GGFC Success:', res);
    } catch (error) {
      console.log('Approval GGFC Error:', error);
    }
  };

  // Approve PancakeSwap Router to spend USDT
  const approveUSDT = async () => {
    try {
      const res = await writeContract({
        address: tokenB,
        abi: usdt_abi,
        functionName: 'approve',
        args: [routerAddress, parseUnits(amountB.toString(), 18)], // USDT has 18 decimals
      });
      console.log('Approval USDT Success:', res);
    } catch (error) {
      console.log('Approval USDT Error:', error);
    }
  };

  const args = [
    tokenA,
    tokenB,
    parseUnits(amountA.toString(), 6), // GGFC 6 decimals
    parseUnits(amountB.toString(), 18), // USDT 18 decimals
    parseUnits((amountA * 0.95).toString(), 6), // Minimum GGFC with 5% slippage
    parseUnits((amountB * 0.95).toString(), 18), // Minimum USDT with 5% slippage
    address, // Your wallet address (recipient of liquidity tokens)
    Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes deadline
  ];

  // console.log(args);

  // Add Liquidity function
  const addLiquidity = async () => {
    try {
      const res = await writeContract({
        address: routerAddress,
        abi: router_abi,
        functionName: 'addLiquidity',
        args,
        // overrides: {
        //   value: parseUnits((0.5).toString(), 18),
        //   gasLimit: 300000, // Adjust gas limit if necessary
        // }
      });
      console.log('Add Liquidity Success:', res);
    } catch (error) {
      console.log('Add Liquidity Error:', error);
    }
  };

  return (
    <>
      <div>
        <button onClick={approveGGFC}>Approve GGFC</button>
        <button onClick={approveUSDT}>Approve USDT</button>
        <button onClick={addLiquidity}>Add Liquidity</button>
      </div>
    </>
  );
}

export default App;
