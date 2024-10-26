import React, { useState, useEffect, useRef } from 'react'
import { ConnectWallet, Button } from './components'
import { parseUnits, parseEther, formatEther } from 'viem'
import { useAccount, useReadContract, useWriteContract, useBalance, useTransactionConfirmations } from 'wagmi';
import { isNumeric } from './utils/help'

import VAULT_ABI from './abi/vault.json'
const VAULT_ADDRESS = "0x280DC676FE9C5e1f220Eab5339919c43258DC495"

function Deposit() {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { writeContract, error, isPending, data: transactionHash, isSuccess } = useWriteContract();
  const { address, isConnected } = useAccount()
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    if (error) {
      var _error = JSON.parse(JSON.stringify(error))
      console.log("writeContract ERROR:", _error);
      setErrorMessage(_error?.shortMessage ?? '')
    }
  }, [error])



  const { data: contractBalance, isLoading: contractBalanceLoading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'contractBalance',
  })

  const { data: bnbBalance, isLoading: bnbBalanceLoading } = useBalance({ address })

  const { data: user_balance_in_vault, isLoading: balance_in_vault_loading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'balances',
    args: [address]
  })

  // console.log({ contractBalance, bnbBalance, owner, user_balance_in_vault });


  // Approve PancakeSwap Router to spend your custom token GGFC
  const deposit = async () => {

    if (!depositAmount) {
      setErrorMessage("Enter BNB deposit amount.")
      return
    }

    try {
      const res = await writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'deposit',
        // args: [routerAddress, parseUnits(amountA.toString(), 6)], // GGFC has 6 decimals
        value: parseEther(depositAmount.toString()),

      });
      console.log('Deposit Success:', res);
    } catch (error) {
      console.log('Depositing Error:', error);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center mt-4 border p-4 rounded-lg border-slate-700'>
        <img className='w-10' src='https://seeklogo.com/images/B/binance-smart-chain-bsc-logo-9C34053D61-seeklogo.com.png' />
        <h1 className='ml-6 text-3xl'>BNB</h1>
        <div className='flex flex-col items-end'>
          <input
            className='w-[70%] bg-transparent outline-none text-[3.5em] text-right text-slate-300 placeholder:text-slate-600 '
            placeholder='0.0'
            value={depositAmount?.toString() || ''}
            onChange={(_) => {
              const val = _.target.value
              if (!isNumeric(val)) return
              setDepositAmount(val)
              if (val > Number(bnbBalance?.formatted)) {
                setErrorMessage("You don't have enough balance.")
              } else {
                setErrorMessage()
              }
            }}
            ref={inputRef}

          />
          {bnbBalance && <p className='text-slate-400'>Balance : {bnbBalance?.formatted}</p>}
        </div>
      </div>

      <div>
        {errorMessage && <p className='text-orange-600  p-2 rounded-md text-sm'>
          {/* <span className="material-symbols-rounded">error</span> */}
          {errorMessage}</p>}

        {transactionHash && <div className='font-light items-center justify-between  mt-8  border border-green-400 text-green-400 p-2 rounded-lg bg-[#ffffff20]'>
          <p className=''>Deposit Transaction</p>
          <p className='text-xs'>{transactionHash}</p>
          <a className='text-white' href={'https://testnet.bscscan.com/tx/' + transactionHash}>View on explorer</a>
        </div>}
      </div>


      <div className='mt-8'>
        {!isConnected ? <ConnectWallet loading={false} title={'Connect'} /> :
          <Button
            title={isPending ? 'processing...' : 'Deposit'}
            loading={false}
            onClick={deposit}
            className="my-6"
          />
        }

        {<div className='flex justify-between mt-4'>
          <p className='text-slate-400'>Your total invest in BeeOne vault :</p> <p>{balance_in_vault_loading ? '--' : formatEther(user_balance_in_vault ?? '0')} BNB</p>
        </div>}

        {contractBalance && <div className='flex justify-between mb-4 '>
          <p className='text-slate-400'>BeeOne Vault Balance :</p><span className='primary-text'>{formatEther(contractBalance ?? '0')} BNB</span>
        </div>}
      </div>

    </div>
  )
}

export default Deposit
