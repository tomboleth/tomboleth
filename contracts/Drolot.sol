pragma solidity ^0.4.4;


contract Owned {
    uint public birthBlock;
    address public owner; // set internal ?

    function Owned() {
	    owner = msg.sender;
	    birthBlock = block.number;
    }
    function close() onlyOwner {suicide(owner);}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Withdrawable is Owned{
	mapping (address => uint) public pendingWithdrawals;
	uint bank = 0;

	function withdraw() {
		uint amount = pendingWithdrawals[msg.sender];
		pendingWithdrawals[msg.sender] = 0;
		msg.sender.transfer(amount);
	}

	function getBank() onlyOwner {
		msg.sender.transfer(bank);
	}
}

contract Drolot is Owned, Withdrawable {
	address[10] public players;
	uint public numPlayers = 0;
	uint public maxPlayers = 10 ;
	uint public bet = 100 finney;
	uint public lot = 990 finney;
	uint nextBet = 0;
	uint nextLot = 0;
	uint nextMaxPlayers = 0;

	event NewPlayer(
		address _from,
		uint _nplayers
	);

	event Winner(
		address indexed _winner,
                bytes12 indexed message
	);

	function () payable{
		require(msg.value == bet);
		play(msg.sender);	
	}

	function playWithWinnings(){
		require(pendingWithdrawals[msg.sender] >= bet);
		pendingWithdrawals[msg.sender] -= bet;
		play(msg.sender);	
	}

	function changeRules(uint newBet, uint newLot, uint newMaxPlayers) {
		nextBet = newBet;
		nextLot = newLot;
		nextMaxPlayers = newMaxPlayers;
	}

	function play(address sender) internal{
		insertPlayer(sender);
		NewPlayer(sender, numPlayers);
		if (numPlayers == maxPlayers){
			bank += bet*numPlayers - lot;
			address winner = dro();
			pendingWithdrawals[winner] += lot;
			bytes12 message = "drolotWinner";
			Winner(winner, message);
			clearPlayers();
			if (nextBet != 0){
				bet = nextBet;
				lot = nextLot;
				maxPlayers = nextMaxPlayers;
				nextBet = 0;
			}
		}
	}

	function insertPlayer(address player) internal {
		players[numPlayers++] = player;
	}

	function clearPlayers() internal {
		numPlayers = 0;
	}

	function dro() internal returns (address winner){
			uint random = uint(sha3(block.timestamp))%10 +1;
			winner = players[random];
	}	
}
