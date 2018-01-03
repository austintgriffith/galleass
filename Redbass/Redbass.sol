pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract Redbass is Galleasset, HasNoEther, MintableToken {

  string public constant name = "Galleass Redbass";
  string public constant symbol = "G_REDBASS";
  bytes32 public constant image = "redbass";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  function Redbass(address _galleass) Galleasset(_galleass) public {
    totalSupply = INITIAL_SUPPLY;
  }

}
