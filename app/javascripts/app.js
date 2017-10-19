// Import the page's CSS. Webpack will know what to do with it.
//import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import json from '../../build/contracts/Drolot.json'
var Drolot = contract(json);

window.App = {
  start: function() {
    var self = this;
    Drolot.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

    Drolot.deployed().then(function(instance) {
	var drolot = instance;
	console.log(instance);
	var new_player_event = drolot.NewPlayer();
	new_player_event.watch(function(error, result){
		if (!error)
			console.log(result);
	});

	var winner_event = drolot.Winner();

	winner_event.watch(function(error, result){
		if (!error)
			console.log(result);
	});
    });
  }
};


window.addEventListener('load', function() {
	App.start();
});

