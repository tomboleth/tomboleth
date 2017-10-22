pragma solidity ^0.4.4;


contract Owned {
    address public owner; // set internal ?

    function Owned() { owner = msg.sender; }
    function close() onlyOwner {suicide(owner);}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Withdrawable is Owned{
	mapping (address => uint) pendingWithdrawals;

	function withdraw() {
		uint amount = pendingWithdrawals[msg.sender];
		pendingWithdrawals[msg.sender] = 0;
		msg.sender.transfer(amount);
	}

	function getBank() onlyOwner {
		msg.sender.transfer(this.balance);
	}
}

contract Drolot is Owned, Withdrawable {
	address[10] public players;
	uint public numPlayers = 0;
	uint public bet = 100 finney;
	uint public lot = 990 finney;
	uint nextBet = 0;
	uint nextLot = 0;

	event NewPlayer(
		address indexed _from
	);

	event Winner(
		address indexed _winner
	);

	function () payable{
		require(msg.value == bet);
		insert(msg.sender);
		NewPlayer(msg.sender);
		if (numPlayers == 10){
			address winner = dro();
			pendingWithdrawals[winner] += lot;
			Winner(winner);
			clear();
			if (nextBet != 0){
				bet = nextBet;
				lot = nextLot;
				nextBet = 0;
			}
		}
	}

	function changeRules(uint newBet, uint newLot) {
		nextBet = newBet;
		nextLot = newLot;
	}

	function insert(address player) internal {
		players[numPlayers++] = player;
	}

	function clear() internal {
		numPlayers = 0;
	}

	function dro() internal returns (address winner){
			uint random = uint(sha3(block.timestamp))%10 +1;
			winner = players[random];
	}	
}
