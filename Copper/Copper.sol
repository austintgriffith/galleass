pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import 'ERC677Token.sol';
import 'Galleasset.sol';

contract Copper is Galleasset, HasNoEther, MintableToken, ERC677Token {

  string public constant name = "Galleass Copper";
  string public constant symbol = "G_COPPER";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  function Copper(address _galleass) Galleasset(_galleass) public {
    totalSupply = INITIAL_SUPPLY;
  }

}
