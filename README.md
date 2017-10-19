* First run `npm install` to install dependencies
* Then run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").
* Then run `npm run dev` to build the app and serve it on http://localhost:8080
* In `truffle console`
 to = contract_address
 from = web3.eth.accounts[0]
 amount = web3.toWei(0.1, "ether")
 web3.eth.sendTransaction({from:from, to:to, value: amount});
 
