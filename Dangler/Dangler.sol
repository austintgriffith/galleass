pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  Dangler is a species of fish in Galleass.

*/

import 'Galleasset.sol';
import 'ERC677Token.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract Dangler is Galleasset, ERC20Mintable, ERC677Token {

  string public constant name = "Galleass Dangler";
  string public constant symbol = "G_DANGLER";
  bytes32 public constant image = "dangler";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  constructor(address _galleass) Galleasset(_galleass) public {
    _totalSupply = INITIAL_SUPPLY;
  }

  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= _balances[_from]);
    require(hasPermission(msg.sender,"transferTimber"));

    _balances[_from] = _balances[_from].sub(_value);
    _balances[_to] = _balances[_to].add(_value);
    emit Transfer(_from, _to, _value);

    return true;
  }

  function galleassMint(address _to,uint _amount) public returns (bool){
    require(hasPermission(msg.sender,"mintTimber"));
    _mint(_to,_amount);
    return true;
  }


}
