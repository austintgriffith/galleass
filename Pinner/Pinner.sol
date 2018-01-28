pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  Pinner is a species of fish in Galleass.

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract Pinner is Galleasset, HasNoEther, MintableToken {

  string public constant name = "Galleass Pinner";
  string public constant symbol = "G_PINNER";
  bytes32 public constant image = "pinner";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  function Pinner(address _galleass) Galleasset(_galleass) public {
    totalSupply = INITIAL_SUPPLY;
  }

  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(hasPermission(msg.sender,"transferFish"));

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(_from, _to, _value);
    return true;
  }

}
