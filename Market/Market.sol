pragma solidity ^0.4.23;

/*

https://galleass.io
by Austin Thomas Griffith

The market facilitates the buying and selling of different tokens

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract Market is Galleasset, HasNoEther {

  function Market(address _galleass) public Galleasset(_galleass) { }


  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => address))) public landOwners;
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public buyPrices;
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public sellPrices;

  //standard tile interface
  //called when tile is purchased from Land contract
  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) {
    landOwners[_x][_y][_tile] = _owner;
  }

  function setBuyPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public returns (bool) {
    require(msg.sender==landOwners[_x][_y][_tile]);
    buyPrices[_x][_y][_tile][_token] = _price;
    return true;
  }
  function setSellPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public returns (bool) {
    require(msg.sender==landOwners[_x][_y][_tile]);
    sellPrices[_x][_y][_tile][_token] = _price;
    return true;
  }

  function sell(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) public returns (bool) {
    //token must have a buy price
    require(buyPrices[_x][_y][_tile][_token]>0);
    //move their tokens in
    StandardToken tokenContract = StandardToken(_token);
    require(tokenContract.galleassTransferFrom(msg.sender,address(this),_amount));
    //send them the correct amount of copper
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transfer(msg.sender,buyPrices[_x][_y][_tile][_token]*_amount));
  }

  function buy(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) public returns (bool) {
    //token must have a sell price
    require(sellPrices[_x][_y][_tile][_token]>0);
    //get their copper 
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transfer(msg.sender,buyPrices[_x][_y][_tile][_token]*_amount));
    //move their tokens in
    StandardToken tokenContract = StandardToken(_token);
    require(tokenContract.galleassTransferFrom(msg.sender,address(this),_amount));
  }

  function withdrawToken(address _token,uint256 _amount) public onlyOwner isBuilding returns (bool) {
    StandardToken token = StandardToken(_token);
    token.transfer(msg.sender,_amount);
    return true;
  }
}

contract StandardToken {
  bytes32 public image;
  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function balanceOf(address _owner) public view returns (uint256 balance) { }
}
