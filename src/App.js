import { useState } from 'react';
import { ethers } from 'ethers';
import ContractJSON from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

function App() {
  const [gm, setGm] = useState();

  async function requestAccount() {
    await ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGm() {
    if (typeof ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.REACT_APP_ALCHEMY_API_KEY);
      const contract = new ethers.Contract(contractAddress, ContractJSON.abi, provider);
      try {
        const isGm = await contract.isGm();
        setGm(isGm);
        console.log('isGm: ', isGm);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGmButton() {
    if (typeof ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.REACT_APP_ALCHEMY_API_KEY);
      const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
      const signer = wallet.connect(provider);
      const contract = new ethers.Contract(contractAddress, ContractJSON.abi, signer);
      const transaction = await contract.toggleGm();
      await transaction.wait();
      fetchGm();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
