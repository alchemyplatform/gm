Prerequisites:

Verify you have node js

```
node --version
```

If not, install [node js ](https://nodejs.org)

- npm (recommended: nvm)
- hardhat
 
 Apple/Linux install:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.2/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 16
nvm use 16
nvm alias default 16
```
Windows install:

[nvm for windows](https://github.com/coreybutler/nvm-windows/releases/download/1.1.9/nvm-setup.zip)
Restart may be required.

1. Create react project:

`npx create-react-app gm`

- delete yarn.lock since we're using npm instead of yarn

1. Create hardhat project:

`npx hardhat`

1. Talk through:
- Greeter contract
- sample script
    - `npx hardhat run scripts/sample-script.js`

1. Modify Greeter contract to become gm contract

1. Set up Alchemy app
2. Set up MetaMask app and get test rinkeby
- chainlink faucet
- paradigm faucet
- plug the alchemy faucet
- alchemy discord

1. Configure hardhat to deploy to rinkeby

```jsx
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};
```

1. Set up dotenv
    - `npm install —save-dev dotenv`
    
2. Finish rinkeby config in hardhat
3. Deploy to rinkeby

`npx hardhat run scripts/sample-script.js --network rinkeby`

```jsx
Greeter deployed to: 0x6bB76f66e2AC71a5C73A820404aC47D0dd42c1b4
```

1. See the contract deployed on [rinkeby.etherscan.](http://rinkeby.etherscan.com)io
- [https://rinkeby.etherscan.io/address/0x6bB76f66e2AC71a5C73A820404aC47D0dd42c1b4](https://rinkeby.etherscan.io/address/0x6bB76f66e2AC71a5C73A820404aC47D0dd42c1b4)

1. Check out Alchemy dashboard

1. Talk about the compiled contract json file containing abi in `./artifacts`
2. Load the react website
- `npm start` in root directory
1. copy over the artifacts folder into `./src`
2. add imports

```jsx
import { useState } from 'react';
import { ethers } from 'ethers';
import ContractJSON from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';
require('dotenv').config();
```

1. update the .env file to include react environment variables

```jsx
REACT_APP_ALCHEMY_API_KEY=
REACT_APP_PRIVATE_KEY=
REACT_APP_CONTRACT_ADDRESS=
```

1. Add `useState()` and three functions

```jsx
function App() {
	// MetaMask injects the ethereum object into the webpage.
	const ethereum = window.ethereum;

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
```

1. Update App.css to include styling for gm

```css
.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-header-gm {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: black;
}
```

1. Update App.js

```jsx
import { useState } from 'react';
import { ethers } from 'ethers';
import ContractJSON from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';
require('dotenv').config();

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  // MetaMask injects the ethereum object into the webpage.
	const ethereum = window.ethereum;

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

  requestAccount();

  console.log("gm", gm);
  const headerClass = gm ? "App-header-gm" : "App-header";

  return (
    <div className="App">
      <header className={headerClass}>
        <button onClick={fetchGm}>GM?</button>
        <button onClick={setGmButton}>GM</button>
      </header>
    </div>
  );
}

export default App;
```

1. Look at the dashboard and see all your requests!!


## Troubleshooting

On windows if you recieve the error:

**Module not found: Error: Can't resolve 'fs' in node_modules\dotenv\lib'**

Then follow these steps:

In **harhat.config.js** and **App.js** ***remove*** the line:

```
require('dotenv').config();
```

And install 

```
npm install dotenv-webpack --save-dev
```
Create a new file called **webpack.config.js** and put it at the same level as your **.env** file. And put this inside:

```
// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  
  plugins: [
    new Dotenv()
  ]
  
};
```

Then run ```npm start``` the error should be resolved. 