var Drolot = artifacts.require("./Drolot.sol");
var value = web3.toWei(0.1, "ether"); 

contract('Drolot', function(accounts) {
  it("should send 100 finney from the first account", function() {
    return Drolot.deployed().then(function(instance) {
      var from = accounts[0];
      var to = instance.contract.address;
      web3.eth.sendTransaction({ from: from, to: to, value: value });
      return web3.eth.getBalance(instance.contract.address);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), value*1, "transfer went wrong");
    });
  });

  it("should send 100 finney from other accounts", function() {
    return Drolot.deployed().then(function(instance) {
      var to = instance.contract.address;
      for (var i = 1; i < 10; i++){
	      var from = accounts[i];
      	      web3.eth.sendTransaction({ from: from, to: to, value: value });
      }
      return web3.eth.getBalance(instance.contract.address);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), value*10, "transfer went wrong");
    });
  });



/*  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
    });
  });

  it("should send coin correctly", function() {
    var meta;

    //    Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
*/
});
