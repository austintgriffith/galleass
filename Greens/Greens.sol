pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  Greens are picked from bare grass resources and provide need nutrition to Citizens

*/

import 'Galleasset.sol';
import 'ERC677Token.sol';
import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract Greens is Galleasset, MintableToken, ERC677Token {

  string public constant name = "Galleass Greens";
  string public constant symbol = "G_GREENS";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  constructor(address _galleass) Galleasset(_galleass) public {
    totalSupply_ = INITIAL_SUPPLY;
  }

  function galleassMint(address _to,uint _amount) public returns (bool){
    require(hasPermission(msg.sender,"mintGreens"));
    totalSupply_ = totalSupply_.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(hasPermission(msg.sender,"transferGreens") || hasPermission(msg.sender,"transferFood"));

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(_from, _to, _value);
    return true;
  }


}
