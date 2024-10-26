import { useState } from 'react';
import './App.css';
import { parseUnits, formatEther, formatUnits } from 'viem';
import ggfc_abi from './abi/ggfc.json';
import usdt_abi from './abi/usdt.json';
import router_abi from './abi/router.json';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';

function App() {
    // PancakeSwap V2 Router on BSC Testnet
    const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
    const tokenA = "0x49bd7F51FC8e1eB0628Bb409E0A0A5cE034e2ACC"; // GGFC token address
    const tokenB = "0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48"; // USDT token address

    const { writeContract, error } = useWriteContract();
    const { address } = useAccount();

    const [swapAmount, setSwapAmount] = useState(100); // Amount to swap

    console.log({ error });



    // const { data } = useReadContract({
    //     abi: ggfc_abi,
    //     address: tokenA,
    //     functionName: 'totalSupply',
    // })

    const { data: ggfc_balance } = useReadContract({
        abi: ggfc_abi,
        address: tokenA,
        functionName: 'balanceOf',
        args: [address]
    })

    const { data: usdt_balance } = useReadContract({
        abi: usdt_abi,
        address: tokenB,
        functionName: 'balanceOf',
        args: [address]

    })

    console.log({ usdt_balance, ggfc_balance });


    // Swap tokens using swapExactTokensForTokens
    const swapTokens = async () => {
        try {
            const res = await writeContract({
                address: routerAddress,
                abi: router_abi,
                functionName: 'swapExactTokensForTokens',
                args: [
                    parseUnits(swapAmount.toString(), 6), // Amount of GGFC (6 decimals)
                    0, // Minimum amount of USDT (can set slippage tolerance)
                    [tokenA, tokenB], // Path: GGFC -> USDT
                    address, // Recipient address (your wallet)
                    Math.floor(Date.now() / 1000) + 60 * 20, // 20-minute deadline
                ],
                overrides: {
                    gasLimit: 300000, // Adjust gas limit if necessary
                }
            });
            console.log('Swap Success:', res);
        } catch (error) {
            console.log('Swap Error:', error);
        }
    };

    return (
        <>
            <div>
                <p>{'GGFC > USDT'}</p>
                <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    placeholder="Amount to Swap"
                />
                <button onClick={swapTokens}>Swap Tokens</button>
               
               <section>
               {ggfc_balance && <p>Your GGFC: {formatUnits(ggfc_balance.toString(), 6)}</p>}
               {usdt_balance && <p>Your USDT: {formatEther(usdt_balance.toString())}</p>}
               </section>
            </div>
        </>
    );
}

export default App;
