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
    require(msg.sender==getContract("Land") || msg.sender==getContract("LandLib"));
    landOwners[_x][_y][_tile] = _owner;
    emit LandOwner(_x,_y,_tile,_owner);
  }
  event LandOwner(uint16 _x,uint16 _y,uint8 _tile,address _owner);

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

  function sell(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) public isGalleasset("Market") returns (bool) {
    //token must have a buy price
    require(buyPrices[_x][_y][_tile][_token]>0);
    //move their tokens in
    StandardToken tokenContract = StandardToken(_token);
    require(tokenContract.galleassTransferFrom(msg.sender,address(this),_amount));
    //send them the correct amount of copper
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transfer(msg.sender,buyPrices[_x][_y][_tile][_token]*_amount));
  }

  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("Market") returns (bool){
    TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==1){
      return buy(_sender,_amount,_data);
    } else {
      revert("unknown action");
    }
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  function buy(address _sender, uint _amount, bytes _data) internal returns (bool) {
    address copperContractAddress = getContract("Copper");
    require(msg.sender == copperContractAddress);
    uint16 _x = uint16(_data[1]) << 8 | uint16(_data[2]);
    uint16 _y = uint16(_data[3]) << 8 | uint16(_data[4]);
    uint8 _tile = uint8(_data[5]);

    address _tokenAddress = getAddressFromBytes(6,_data);
    uint _amountToBuy = getRemainingUint(26,_data);

    emit Debug(_x,_y,_tile,_tokenAddress,_amountToBuy);

    //token must have a sell price
    require(sellPrices[_x][_y][_tile][_tokenAddress]>0);
    //they must send enough copper
    require(_amount>=sellPrices[_x][_y][_tile][_tokenAddress]*_amountToBuy);
    //send them their new tokens
    StandardToken tokenContract = StandardToken(_tokenAddress);
    require(tokenContract.transfer(msg.sender,_amount));
    return true;
  }
  event Debug(uint16 _x,uint16 _y,uint8 _tile,address _tokenAddress,uint _amountToBuy);

  function getRemainingBytes(uint8 _offset, bytes _data) internal constant returns (bytes32 newBytes){
    uint8 b = 31;
    uint8 d = uint8(_data.length-1);
    while(d>_offset-1){
      newBytes |= bytes32(_data[d--] & 0xFF) >> (b-- * 8);
    }
    return newBytes;
  }

  function getRemainingUint(uint8 _offset,bytes _data) constant returns (uint) {
    uint result = 0;
    uint endsAt = _data.length;
    uint8 d = uint8(endsAt-1);
    while(d>_offset-1){
      uint c = uint(_data[d]);
      uint to_inc = c * ( 16 ** ((endsAt - d-1) * 2));
      result += to_inc;
      d--;
    }
    return result;
  }

  function getAddressFromBytes(uint8 _offset,bytes _data) constant returns (address) {
    uint result = 0;
    uint endsAt = _offset+20;
    uint8 d = uint8(endsAt-1);
    while(d>_offset-1){
      uint c = uint(_data[d]);
      uint to_inc = c * ( 16 ** ((endsAt - d-1) * 2));
      result += to_inc;
      d--;
    }
    return address(result);
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
