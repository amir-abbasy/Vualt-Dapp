import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WagmiProvider } from './components'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider>
      <App />
    </WagmiProvider>
  </StrictMode>,
)