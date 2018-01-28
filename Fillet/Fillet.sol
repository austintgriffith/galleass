pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  A fillet is produced when a fishmonger butchers a fish. It is used to feed
  citizens and is the first type of food introduced to Galleass. 

*/

import 'Galleasset.sol';
import 'ERC677Token.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';


contract Fillet is Galleasset, HasNoEther, MintableToken, ERC677Token {

  string public constant name = "Galleass Fillet";
  string public constant symbol = "G_FILLET";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 0;

  function Fillet(address _galleass) Galleasset(_galleass) public {
    totalSupply = INITIAL_SUPPLY;
  }

  function galleassMint(address _to, uint256 _amount) canMint public returns (bool) {
    require(hasPermission(msg.sender,"mintFillet"));
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

}
