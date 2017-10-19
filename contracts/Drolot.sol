pragma solidity ^0.4.4;

contract Drolot {
	address public owner;
	address[10] public players;
	uint public num_players = 0;
	uint lot = 990 finney;

	event NewPlayer(
		address indexed _from
	);

	event Winner(
		address indexed _winner
	);

	function Drolot() {
		owner = msg.sender;
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

	function () payable{
		require(msg.value == 100 finney);
		insert(msg.sender);
		NewPlayer(msg.sender);
		if (num_players == 10){
			address winner = dro();
			winner.transfer(lot);
			Winner(winner);
			clear();
		}
	}
}
