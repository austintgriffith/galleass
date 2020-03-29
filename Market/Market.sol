pragma solidity ^0.4.23;

/*

https://galleass.io
by Austin Thomas Griffith

The market facilitates the buying and selling of different tokens

*/

import 'StandardTile.sol';

contract Market is StandardTile {

  constructor(address _galleass) public StandardTile(_galleass) { }

  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public buyPrices; //how much the market will buy items for
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public sellPrices; //how much the market will sell items for

  function setBuyPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public isGalleasset("Market") isLandOwner(_x,_y,_tile) returns (bool) {
    buyPrices[_x][_y][_tile][_token] = _price;
    return true;
  }
  function setSellPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public isGalleasset("Market") isLandOwner(_x,_y,_tile) returns (bool) {
    sellPrices[_x][_y][_tile][_token] = _price;
    return true;
  }

  //if the market has permission to galleassTransferFrom your token you can call sell directly
  // it's better to 667 them in without special galeeass permission
  /*function sell(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) public isGalleasset("Market") returns (bool) {
    //token must have a buy price
    require(buyPrices[_x][_y][_tile][_token]>0);
    //move their tokens in
    StandardToken tokenContract = StandardToken(_token);
    require(tokenContract.galleassTransferFrom(msg.sender,address(this),_amount));
    //send them the correct amount of copper
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transfer(msg.sender,buyPrices[_x][_y][_tile][_token]*_amount));
  }*/

  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("Market") returns (bool){
    emit TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==0){
      return _sendToken(_sender,_amount,_data);
    } else if(action==1){
      return _buy(_sender,_amount,_data);
    } else if(action==2){
      return _sell(_sender,_amount,_data);
    }else {
      revert("unknown action");
    }
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  function _buy(address _sender, uint _amount, bytes _data) internal returns (bool) {
    //you must be sending in copper
    require(msg.sender == getContract("Copper"));
    //increment tile's copper balance
    _incrementTokenBalance(_x,_y,_tile,msg.sender,_amount);
    //parse land location out of data
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);
    address _tokenAddress = getAddressFromBytes(6,_data);

    //token must have a sell price
    require(sellPrices[_x][_y][_tile][_tokenAddress]>0);
    //increment tile's token balance
    _incrementTokenBalance(_x,_y,_tile,_tokenAddress,_amount);

    uint amountOfTokensToSend = _amount/sellPrices[_x][_y][_tile][_tokenAddress];

    //make sure this tile has enough of this token to send
    _decrementTokenBalance(_x,_y,_tile,_tokenAddress,amountOfTokensToSend);
    //send them their new tokens
    StandardToken tokenContract = StandardToken(_tokenAddress);
    require(tokenContract.transfer(_sender,amountOfTokensToSend));

    emit Buy(_x,_y,_tile,_amount,_tokenAddress,amountOfTokensToSend);

    return true;
  }
  event Buy(uint16 _x,uint16 _y,uint8 _tile,uint copperSpent, address _tokenAddress,uint amountOfTokensToSend);

  //player is sending some token to the market and expecting payment in copper based on the buyPrice the market is willing to pay for the incoming token
  function _sell(address _sender, uint _amount, bytes _data) internal returns (bool) {
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);

    //token must have a buy price
    require(buyPrices[_x][_y][_tile][msg.sender]>0);

    //increment tile's balance of this token
    _incrementTokenBalance(_x,_y,_tile,msg.sender,_amount);

    emit Sell(_x,_y,_tile,msg.sender,_amount,_sender);

    uint amountOfCopperToSend = _amount*buyPrices[_x][_y][_tile][msg.sender];
    //make sure this tile has enough copper to buy the token
    _decrementTokenBalance(_x,_y,_tile,getContract("Copper"),amountOfCopperToSend);
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transfer(_sender,amountOfCopperToSend));
    return true;
  }
  event Sell(uint16 _x,uint16 _y,uint8 _tile,address _tokenAddress,uint _amount,address _sender);

}

contract StandardToken {
  bytes32 public image;
  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function balanceOf(address _owner) public view returns (uint256 balance) { }
}
