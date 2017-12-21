pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract Catfish is Galleasset, HasNoEther, MintableToken {

  string public constant name = "Galleass Catfish";
  string public constant symbol = "G_CATFISH";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  function Catfish(address _galleass) Galleasset(_galleass) public {
    totalSupply = INITIAL_SUPPLY;
  }

}
