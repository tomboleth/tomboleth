pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Drolot.sol";

contract TestDrolot {

  function testInitialRulesUsingDeployedContract() {
    Drolot drolot = Drolot(DeployedAddresses.Drolot());

    uint expected_bet = 100 finney;
    uint expected_lot = 990 finney;

    Assert.equal(drolot.lot(), expected_lot, "Lot should be 990 initially");
    Assert.equal(drolot.bet(), expected_bet, "Bet should be 100  initially");
  }

  function testInitialRulesWithNewDrolot() {
    Drolot drolot = new Drolot();

    uint expected_bet = 100 finney;
    uint expected_lot = 990 finney;

    Assert.equal(drolot.lot(), expected_lot, "Lot should be 990 initially");
    Assert.equal(drolot.bet(), expected_bet, "Bet should be 100 initially");
  }

}
