import './App.css';
import Liquidity from './Liquidity'
import LiquidityEth from './LiquidityEth'
import Swap from './Swap'


function App() {

  return (
    <div>
      <w3m-button />
      {/* <LiquidityEth /> */}
      <Liquidity />
      <Swap />
    </div>
  );
}

export default App;
