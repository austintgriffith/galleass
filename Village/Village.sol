pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Village is where food is consumed and citizens are created
*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Village is Galleasset, Ownable {

  address landOwner;

  function Village(address _galleass) public Galleasset(_galleass) { }
  function () public {revert();}

  function onTokenTransfer(address _sender, uint _amount, bytes _data) {
    /*if( msg.sender == getContract("Timber") ){
      TokenTransfer(msg.sender,_sender,_amount,_data);
    }else{
      revert();
    }*/
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  function createCitizen(address food1,address food2,address food3,address food4,address food5) returns (bool) {
    
  }


  function withdraw(uint256 _amount) public onlyOwner isBuilding returns (bool) {
    require(this.balance >= _amount);
    assert(owner.send(_amount));
    return true;
  }
  function withdrawToken(address _token,uint256 _amount) public onlyOwner isBuilding returns (bool) {
    StandardToken token = StandardToken(_token);
    token.transfer(msg.sender,_amount);
    return true;
  }
}

contract StandardToken {
  function transfer(address _to, uint256 _value) public returns (bool) { }
}
