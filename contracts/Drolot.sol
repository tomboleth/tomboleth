pragma solidity ^0.4.4;


contract Owned {
    address public owner; // set internal ?

    function owned() { owner = msg.sender; }
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
	uint public num_players = 0;
	uint public bet = 100 finney;
	uint public lot = 990 finney;

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
		if (num_players == 10){
			address winner = dro();
			pendingWithdrawals[winner] += lot;
			Winner(winner);
			clear();
		}
	}

	function changeRules(uint newBet, uint newLot) {
		bet = newBet;
		lot = newLot;
	}

	function insert(address player) internal {
		players[num_players++] = player;
	}

	function clear() internal {
		num_players = 0;
	}

	function dro() internal returns (address winner){
			uint random = uint(sha3(block.timestamp))%10 +1;
			winner = players[random];
	}	
}
