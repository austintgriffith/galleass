pragma solidity ^0.4.15;

contract Catfish is HasNoEther, StandardToken {
  
  string public constant name = "Galleass Catfish";
  string public constant symbol = "G_CATFISH";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 1000;

  function Catfish() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}

import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';
