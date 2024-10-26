import { useState } from 'react'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'


function App() {
  
  const [activeTab, setActiveTab] = useState('deposit') // deposit || withdraw
  // const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  // var address_slice = address && address.substring(0, 4) + "..." + address.substring(address.length - 4)

  return (
    <div className='h-screen w-screen flex items-center justify-center capitalize text-white bg-gradient-to-br from-slate-900 to-black overflow-clip'>
      {/* <img src="./matrix.svg" className='absolute grayscale max-w-screen max-h-screen z-0' /> */}

      <div className='size-96 bg-gradient-to-tr from-yellow-300 to-transparent rounded-full blur-[150px] absolute bottom-0 ' />
      <div className='size-96 bg-gradient-to-tr from-yellow-600 to-transparent rounded-full blur-[150px] absolute bottom-[40%] ' />
      <div className='lg:w-[40%] min-h-[60vh]  border border-gray-800 p-8 rounded-3xl  bg-gradient-to-br from-black to-transparent backdrop-blur-xl'>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center'>
            <span class="material-symbols-rounded">
              wallet
            </span>
            <h1 className='ml-6 text-3xl'>BeeOne Vault</h1>
          </div>

          {/* D I S C O N N E C T  */}
          {/* {isConnected && <div className='flex text-xs font-light items-center justify-between border border-green-800 p-2 rounded-lg bg-[#ffffff10]'>
            <p>{address_slice}</p>
            <button className='text-sm ml-4'
              onClick={() => open()}
            >Disconnect</button>
          </div>} */}
          {isConnected && <w3m-button />}
        </div>


        {/* T A B S  */}
        <div className='flex justify-between text-2xl text-center mt-2'>
          <button
            onClick={_ => setActiveTab('deposit')}
            className={`${activeTab == 'deposit' ? 'primary-text' : ''} border border-gray-700 text-slate-400 hover:text-yellow-100 transition-all hover:bg-black py-2 p-4 rounded-l-lg flex flex-1 justify-center `}>Deposit</button>
          <button
            onClick={_ => setActiveTab('withdraw')}
            className={`${activeTab == 'withdraw' ? 'primary-text' : ''} border border-gray-700 text-slate-400  hover:text-yellow-100 transition-all  hover:bg-black py-2 p-4 rounded-r-lg flex flex-1 justify-center`}>Withdraw</button>
        </div>

        {activeTab == 'deposit' ? <Deposit /> : <Withdraw />}
      </div>

    </div>
  )
}

export default App
