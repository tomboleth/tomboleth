// Import the page's CSS. Webpack will know what to do with it.
//import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { default as UIkit} from 'uikit'
import { default as Icons} from 'uikit/dist/js/uikit-icons'
import { default as $} from 'jquery'
import css from "../index.css";
//import jpg from './app/images/head.jpg'

// Import our contract artifacts and turn them into usable abstractions.
import json from '../../build/contracts/Drolot.json'
var Drolot = contract(json);

UIkit.use(Icons);

window.App = {
  start: function() {
    var self = this;
    Drolot.setProvider(web3.currentProvider);

    Drolot.deployed().then(function(instance) {
	console.log(instance.contract);

        /* Events listener from contract */

	var new_player_event = instance.NewPlayer();
	new_player_event.watch(function(error, result){
		if (result.args._nplayers == 1){
			self.clearGame();
		}
		self.addPlayer(result.args._from);
                self.refreshBankBalance(web3.eth.getBalance(instance.contract.address));
	});

	var winner_event = instance.Winner();

	winner_event.watch(function(error, result){
		console.log(result);
		self.addWinner(result.args._winner);
	});

	/* Display web3 or non-web3 interface */
	
	if (window.web3enabled){
	  $(".noweb3").hide();	
	}
	else{
	  $(".web3").hide();	
	}
	
	/* Event listener for input */

        $('#player-balance-address').each(function() {
            var elem = $(this);
            elem.bind("propertychange change click keyup input paste", function(event){
                self.cleanPlayerBalance();
                if (web3.isAddress(elem.val().trim())){
                   self.refreshPlayerBalance(web3.fromWei(instance.contract.pendingWithdrawals.call(elem.val().trim()), "ether"));
    	        }
            });
        });

	/* */

	$("#contract-address").append(instance.contract.address);
	instance.contract.bet.call(function(error, result){$("#send-ether").append(web3.fromWei(result.valueOf()), "ether");})

//	web3.eth.getBalance(instance.contract.address, function(error, result){self.refreshBankBalance(result)});

        /* Players in current game */
	instance.contract.numPlayers.call(function(error, nplayers){
		for(var i=0; i < nplayers; i++){
			instance.contract.players.call( function(error, player){self.addPlayer(player);}  );
		}
	});

        /* All the winners */
	instance.contract.birthBlock.call( function(error, birthBlock){
       						var filter = web3.eth.filter({fromBlock: birthBlock , toBlock: 'latest', address: instance.contract.address, topics: [null, null, "0x64726f6c6f7457696e6e65720000000000000000000000000000000000000000"]});
        					filter.watch(function(error, result){ self.addAllWinner((result.topics[1])); });
	});
    });

  },

    cleanPlayerBalance: function() {
        $("#player-balance").children().remove();
    },

    refreshPlayerBalance: function(address) {
	$("#player-balance").append(`<div>${address}</div>`);
    },

    refreshBankBalance: function(balance) {
	$("#contract-balance").children().remove();
	$("#contract-balance").append(`<div>${balance}</div>`);
    },

    clearGame: function(player) {
	$("#players").empty();
        $("#winner").empty();
    },

    addPlayer: function(player) {
	$("#players").append(`<li class="uk-animation-slide-right"><span uk-icon="icon: user; ratio:0.7">&nbsp;</span>${player}</li>`);
    },

    addWinner: function(winner) {
	$("#winner").append(`<h3 class="uk-text-center uk-text-primary uk-text-lead">Winner</h3><div class="uk-text-primary uk-text-lead" align="center"><span uk-icon="icon: star; ratio:2">&nbsp;</span>${winner}`);
    },

    addAllWinner: function(winner) {
	$("#all-winners").append(`<div>${winner}</div>`);
    }
};


window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
		window.web3enabled = true;
	} else {
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		window.web3enabled = false;
	}
	App.start();
});

