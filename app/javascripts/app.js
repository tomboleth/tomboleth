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
    Drolot.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

    Drolot.deployed().then(function(instance) {
	console.log(instance.contract);

	var new_player_event = instance.NewPlayer();
	new_player_event.watch(function(error, result){
		self.addPlayer(result.args._from);
	});

	var winner_event = instance.Winner();

	winner_event.watch(function(error, result){
		self.addWinner(result.args._winner);
	});

	$("#contract-address").append(instance.contract.address);
	$("#contract-owner").append(instance.contract.owner);

	var nplayers = instance.contract.num_players.call().valueOf();
	for(var i=0; i < nplayers; i++){
		self.addPlayer(instance.contract.players.call(i));
	}
    });
  },

    addPlayer: function(player) {
	$("#players").append(`<div>${player}</div>`);
    },

    addWinner: function(winner) {
	$("#winner").append(`<div>Winner is ${winner}</div>`);
    }
};


window.addEventListener('load', function() {
	App.start();
});

