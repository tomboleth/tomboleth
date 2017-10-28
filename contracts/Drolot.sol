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

contract Withdrawable is Owned {
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

contract Pausable is Owned {
    bool public active = true;
    bool public will_pause = false;

    modifier ifActive {
        require(active);
        _;
    }

    function will_pause() onlyOwner {
        will_pause = true;
    }

    function pause() onlyOwner {
        active = false;
    }

    function start() onlyOwner {
        active = true;
        will_pause = false;
    }
}

contract Drolot is Owned, Withdrawable, Pausable {
    address[10] public players;
    uint public numPlayers = 0;
    uint public maxPlayers = 10 ;
    uint public bet = 100 finney;
    uint public lot = 990 finney;
    uint fees = 10 finney;
    bytes12 idx_message = "drolotWinner";

    event NewPlayer(
        address _from,
        uint _nplayers
    );

    event Winner(
        address indexed _winner,
                bytes12 indexed message
    );

    function () payable ifActive {
        require(msg.value == bet);
        play(msg.sender);
    }

    function playWithWinnings() ifActive{
        require(pendingWithdrawals[msg.sender] >= bet);
        pendingWithdrawals[msg.sender] -= bet;
        play(msg.sender);
    }

    function changeRules(uint newBet, uint newLot, uint newFees, uint newMaxPlayers) {
        bet = newBet;
        lot = newLot;
        fees = newFees;
        maxPlayers = newMaxPlayers;
    }

    function play(address sender) internal{
        insertPlayer(sender);
        NewPlayer(sender, numPlayers);
        if (numPlayers == 1){
            bank += fees;
        }
        else if (numPlayers == maxPlayers){
            address winner = dro();
            pendingWithdrawals[winner] += lot;
            Winner(winner, idx_message);
            clearPlayers();
            if (will_pause){
                active = false;
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
