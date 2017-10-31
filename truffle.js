// Allows us to use ES6 in our migrations and tests.
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "cHbRZrapth8QaiDXVxyK";
var mnemonic = "border exact divorce luxury foil antenna utility employ blame clap goose husband";

require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      from: '0xa6fd65043e3b6e2f62db704ef6d858c657f7f83f'
    },
      ropsten: {
          provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
          network_id: 3,
          gas: 1500000
      }
  }
}
