pragma solidity ^0.4.23;

/*

https://galleass.io
by Austin Thomas Griffith

The market facilitates the buying and selling of different tokens

*/

import 'StandardTile.sol';
import 'DataParser.sol';

contract Market is StandardTile, DataParser {

  constructor(address _galleass) public StandardTile(_galleass) { }

  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public buyPrices;
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint)))) public sellPrices;

  function setBuyPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public isGalleasset("Market") isLandOwner(_x,_y,_tile) returns (bool) {
    buyPrices[_x][_y][_tile][_token] = _price;
    return true;
  }
  function setSellPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price) public isGalleasset("Market") isLandOwner(_x,_y,_tile) returns (bool) {
    sellPrices[_x][_y][_tile][_token] = _price;
    return true;
  }

  //if the market has permissing to galleassTransferFrom your token you can call sell directly
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
    TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==0){
      //action zero should be a transfer... like stocking the tile up
      // you just need to keep track of what is transferred in so you
      // can display it on the modal of the tile and let the withdraw
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
    //parse land location out of data
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);
    address _tokenAddress = getAddressFromBytes(6,_data);
    uint _amountToBuy = getRemainingUint(26,_data);

    emit BuyInternal(_x,_y,_tile,_tokenAddress,_amountToBuy);

    //token must have a sell price
    require(sellPrices[_x][_y][_tile][_tokenAddress]>0);
    //they must send enough copper
    require(_amount>=sellPrices[_x][_y][_tile][_tokenAddress]*_amountToBuy);
    //send them their new tokens
    StandardToken tokenContract = StandardToken(_tokenAddress);
    require(tokenContract.transfer(_sender,_amountToBuy));
    return true;
  }
  event BuyInternal(uint16 _x,uint16 _y,uint8 _tile,address _tokenAddress,uint _amountToBuy);

  function _sell(address _sender, uint _amount, bytes _data) internal returns (bool) {
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);
    uint _amountToSell = getRemainingUint(6,_data);

    emit SellInternal(_x,_y,_tile,msg.sender,_amountToSell);

    //token must have a buy price
    require(buyPrices[_x][_y][_tile][msg.sender]>0);


    if(msg.sender==getContract("Timber")  || msg.sender==getContract("Fillet")  ||
        msg.sender==getContract("Snark")  || msg.sender==getContract("Dangler")  ||
        msg.sender==getContract("Redbass") || msg.sender==getContract("Pinner")  || msg.sender==getContract("Catfish")
      ){
      StandardToken copperContract = StandardToken(getContract("Copper"));
      require(copperContract.transfer(_sender,_amountToSell*buyPrices[_x][_y][_tile][msg.sender]));
      return true;
    }else{
      revert();
    }
  }
  event SellInternal(uint16 _x,uint16 _y,uint8 _tile,address _tokenAddress,uint _amountToSell);

}

contract StandardToken {
  bytes32 public image;
  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function balanceOf(address _owner) public view returns (uint256 balance) { }
}
