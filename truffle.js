// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      from: '0xa6fd65043e3b6e2f62db704ef6d858c657f7f83f'
    }
  }
}
