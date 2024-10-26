import React, { useState, useEffect, useRef } from 'react'
import { ConnectWallet, Button } from './components'
import { parseUnits, parseEther, formatEther } from 'viem'
import { useAccount, useReadContract, useWriteContract, useBalance, useTransactionConfirmations } from 'wagmi';
import { isNumeric } from './utils/help'

import VAULT_ABI from './abi/vault.json'
const VAULT_ADDRESS = "0x280DC676FE9C5e1f220Eab5339919c43258DC495"

function Withdraw() {
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(); // Amount to swap
  const [userAddress, setUserAddress] = useState(); // Amount to swap

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

  const { data: user_balance_in_vault, isLoading: balance_in_vault_loading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'balances',
    args: [userAddress]
  })


  const { data: owner, isLoading: owner_loading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'owner',
  })


  // console.log({ contractBalance, bnbBalance, owner, user_balance_in_vault });



  const withdraw = async () => {
    if (!userAddress) {
      setErrorMessage("User wallet address is empty!.")
      return
    }

    if (!withdrawAmount) {
      setErrorMessage("Enter BNB deposit amount.")
      return
    }

    try {
      const res = await writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'adminWithdrawForUser',
        args: [userAddress, parseEther(withdrawAmount.toString()).toString()],
        // value: parseEther(withdrawAmount.toString()),

      });
      console.log('Withdraw to user Success:', res);
    } catch (error) {
      console.log('Withdraw to user Error:', error);
    }
  };

  const isNotAdmin = owner?.toLowerCase?.() !== address?.toLowerCase?.()

  return (
    <div className='flex flex-col'>
      <div className='items-center mt-4 border p-4 pb-2 rounded-lg border-slate-700'>
        <input
          className='w-full bg-transparent outline-none text-left text-slate-300 placeholder:text-slate-400 focus:border-b border-slate-600 '
          placeholder='Address (0x0..)'
          value={userAddress?.toString() || ''}
          onChange={(_) => {
            const val = _.target.value
            setUserAddress(val)
            // if (val > Number(bnbBalance?.formatted)) {
            //   setErrorMessage("You don't have enough balance.")
            // } else {
            //   setErrorMessage()
            // }
          }}
          ref={inputRef}
        />
      </div>


      <div className='flex justify-between items-center mt-4 border p-4 rounded-lg border-slate-700'>
        <img className='w-10' src='https://seeklogo.com/images/B/binance-smart-chain-bsc-logo-9C34053D61-seeklogo.com.png' />
        <h1 className='ml-6 text-3xl'>BNB</h1>
        <div className='flex flex-col items-end'>
          <input
            className='w-[70%] bg-transparent outline-none text-[3.5em] text-right text-slate-300 placeholder:text-slate-600'
            placeholder='0.0'
            value={withdrawAmount?.toString() || ''}
            onChange={(_) => {
              const val = _.target.value
              if (!isNumeric(val)) return
              setWithdrawAmount(val)
              console.log(val, formatEther(user_balance_in_vault));

              if (val > Number(formatEther(user_balance_in_vault))) {
                setErrorMessage("User don't have enough balance to withdraw.")
              } else {
                setErrorMessage()
              }
            }}
            ref={inputRef}

          />


        </div>
      </div>

      <div className='flex items-end justify-end'>
        <p className='text-slate-400 text-right mr-2'>User total invest in BeeOne vault : </p> <p>{balance_in_vault_loading ? '--' : formatEther(user_balance_in_vault ?? '0')} BNB</p>
      </div>



      <div>
        {errorMessage && <p className='text-orange-600  py-2 rounded-md text-sm'>
          {/* <span className="material-symbols-rounded">error</span> */}
          {errorMessage}</p>}

        {transactionHash && <div className='font-light items-center justify-between  mt-8  border border-green-400 text-green-400 p-2 rounded-lg bg-[#ffffff20]'>
          <p className=''>Withdraw Transaction</p>
          <p className='text-xs'>{transactionHash}</p>
          <a className='text-white' href={'https://testnet.bscscan.com/tx/' + transactionHash}>View on explorer</a>
        </div>}
      </div>


      <div className='mt-8'>
        {isNotAdmin && <p className='text-red-400 '>Admin can only withdraw funds</p>}
        {!isConnected ? <ConnectWallet loading={false} title={'Connect'} /> :
          <Button
            title={isPending ? 'processing...' : 'Withdraw'}
            loading={false}
            onClick={withdraw}
            className="my-6"
            disabled={isNotAdmin}
          />
        }

        {contractBalance && <div className='flex justify-between mb-4 '>
          <p className='text-slate-400'>BeeOne Vault Balance :</p><span className='primary-text font-bold'>{formatEther(contractBalance ?? '0')} BNB</span>
        </div>}
      </div>

    </div>
  )
}

export default Withdraw
