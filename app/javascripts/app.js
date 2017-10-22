// Import the page's CSS. Webpack will know what to do with it.
//import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { default as $} from 'jquery'

// Import our contract artifacts and turn them into usable abstractions.
import json from '../../build/contracts/Drolot.json'
var Drolot = contract(json);

window.App = {
  start: function() {
    var self = this;
    //var web3 = new Web3.providers.HttpProvider("http://localhost:8545")
    Drolot.setProvider(web3.currentProvider);

    Drolot.deployed().then(function(instance) {
	console.log(instance.contract);

	var new_player_event = instance.NewPlayer();
	new_player_event.watch(function(error, result){
		self.addPlayer(result.args._from);
                self.refreshBalance(web3.eth.getBalance(instance.contract.address));
	});

	var winner_event = instance.Winner();

	winner_event.watch(function(error, result){
		self.addWinner(result.args._winner);
	});

	$("#contract-address").append(instance.contract.address);
	$("#contract-owner").append(instance.contract.owner.call());


        self.refreshBalance(web3.eth.getBalance(instance.contract.address));

	var nplayers = instance.contract.numPlayers.call().valueOf();
	for(var i=0; i < nplayers; i++){
		self.addPlayer(instance.contract.players.call(i));
	}
    });
  },

    refreshBalance: function(balance) {
	$("#contract-balance").children().remove();
	$("#contract-balance").append(`<div>${balance}</div>`);
    },

    addPlayer: function(player) {
	$("#players").append(`<div>${player}</div>`);
    },

    addWinner: function(winner) {
	$("#winner").append(`<div>Winner is ${winner}</div>`);
    }
};


window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
		// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}
	App.start();
});

