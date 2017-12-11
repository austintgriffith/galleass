pragma solidity ^0.4.15;

contract Timber is HasNoEther, StandardToken {

  string public constant name = "Galleass Timber";
  string public constant symbol = "G_TIMBER";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 10000;

  function Timber() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}

import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';
