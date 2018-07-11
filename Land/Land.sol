pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Land contract tracks all the procedurally generated islands in Galleass.

  Tiles can be purchased and built upon.

*/

import 'Galleasset.sol';

contract Land is Galleasset {

  uint16 public mainX;
  uint16 public mainY;

  event LandGenerated(uint _timestamp,uint16 _x,uint16 _y,uint8 _island1,uint8 _island2,uint8 _island3,uint8 _island4,uint8 _island5,uint8 _island6,uint8 _island7,uint8 _island8,uint8 _island9);

  mapping (uint16 => mapping (uint16 => uint16[18])) public tileTypeAt;
  mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
  mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
  mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;

  mapping (uint16 => mapping (uint16 => uint16)) public totalWidth;

  function Land(address _galleass) public Galleasset(_galleass) { }
  function () public {revert();}

  function editTile(uint16 _x, uint16 _y,uint8 _tile,uint16 _update,address _contract) onlyOwner isBuilding public returns (bool) {
    tileTypeAt[_x][_y][_tile] = _update;
    contractAt[_x][_y][_tile] = _contract;
    if(contractAt[_x][_y][_tile]!=address(0)){
       StandardTile tileContract = StandardTile(contractAt[_x][_y][_tile]);
       tileContract.onPurchase(_x,_y,_tile,ownerAt[_x][_y][_tile],priceAt[_x][_y][_tile]);
    }
    ownerAt[_x][_y][_tile]=msg.sender;
  }

  function buyTile(uint16 _x,uint16 _y,uint8 _tile) public isGalleasset("Land") returns (bool) {
    require(priceAt[_x][_y][_tile]>0);//must be for sale
    StandardToken copperContract = StandardToken(getContract("Copper"));
    require(copperContract.transferFrom(msg.sender,ownerAt[_x][_y][_tile],priceAt[_x][_y][_tile]));
    ownerAt[_x][_y][_tile]=msg.sender;
    //when a piece of land is purchased, an "onPurchase" function is called
    // on the contract to help the inner contract track events and owners etc
    if(contractAt[_x][_y][_tile]!=address(0)){
       StandardTile tileContract = StandardTile(contractAt[_x][_y][_tile]);
       tileContract.onPurchase(_x,_y,_tile,ownerAt[_x][_y][_tile],priceAt[_x][_y][_tile]);
    }
    BuyTile(_x,_y,_tile,ownerAt[_x][_y][_tile],priceAt[_x][_y][_tile],contractAt[_x][_y][_tile]);
    priceAt[_x][_y][_tile]=0;
    return true;
  }
  event BuyTile(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _price,address _contract);

  //erc677 receiver
  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("Land") returns (bool) {
    TokenTransfer(msg.sender,_sender,_amount,_data);
    //THIS HAS MOVED TO LANDLIB FOR FASTER DEV LOOP/UPGRADABILITY
    //LandLib landLib = LandLib(getContract("LandLib"));
    //landLib.onTokenTransfer(_sender,_amount,_data)
    return false;
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  //allow LandLib to set storage on Land contract
  //this allows me to redeploy the LandLib as I need and leave the
  //generated land alone
  function setTileTypeAt(uint16 _x, uint16 _y, uint8 _tile,uint16 _type) public isGalleasset("Land") returns (bool) {
    require(msg.sender==getContract("LandLib"));
    tileTypeAt[_x][_y][_tile] = _type;
    return true;
  }
  function setContractAt(uint16 _x, uint16 _y, uint8 _tile,address _address) public isGalleasset("Land") returns (bool) {
    require(msg.sender==getContract("LandLib"));
    contractAt[_x][_y][_tile] = _address;
    return true;
  }
  function setOwnerAt(uint16 _x, uint16 _y, uint8 _tile,address _owner) public isGalleasset("Land") returns (bool) {
    require(msg.sender==getContract("LandLib"));
    ownerAt[_x][_y][_tile] = _owner;
    return true;
  }
  function setPriceAt(uint16 _x, uint16 _y, uint8 _tile,uint _price) public isGalleasset("Land") returns (bool) {
    require(msg.sender==getContract("LandLib"));
    priceAt[_x][_y][_tile] = _price;
    return true;
  }
  function setTotalWidth(uint16 _x,uint16 _y,uint16 _width) public returns (bool){
    require(msg.sender==getContract("LandLib"));
    totalWidth[_x][_y] = _width;
    return true;
  }
  function setMainLocation(uint16 _mainX,uint16 _mainY) public returns (bool) {
    require(msg.sender==getContract("LandLib"));
    mainX=_mainX;
    mainY=_mainY;
    return true;
  }
  function signalGenerateLand(uint16 _x,uint16 _y,uint8[9] islands) public returns (bool) {
    require(msg.sender==getContract("LandLib"));
    emit LandGenerated(now,_x,_y,islands[0],islands[1],islands[2],islands[3],islands[4],islands[5],islands[6],islands[7],islands[8]);
  }



  //the land owner can also call setPrice directly
  function setPrice(uint16 _x,uint16 _y,uint8 _tile,uint256 _price) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    priceAt[_x][_y][_tile]=_price;
    return true;
  }

  /* function setTileContract(uint16 _x,uint16 _y,uint8 _tile,address _contract) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    contractAt[_x][_y][_tile]=_contract;
    return true;
  } */

  function transferTile(uint16 _x,uint16 _y,uint8 _tile,address _newOwner) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    ownerAt[_x][_y][_tile]=_newOwner;
    priceAt[_x][_y][_tile]=0;
    return true;
  }

  function getTile(uint16 _x,uint16 _y,uint8 _index) public constant returns (uint16 _tile,address _contract,address _owner,uint256 _price) {
    return (tileTypeAt[_x][_y][_index],contractAt[_x][_y][_index],ownerAt[_x][_y][_index],priceAt[_x][_y][_index]);
  }

  function getTileLocation(uint16 _x,uint16 _y,address _address) public constant returns (uint16) {
    LandLib landLib = LandLib(getContract("LandLib"));
    uint8 tileIndex = findTileByAddress(_x,_y,_address);
    if(tileIndex==255) return 0;
    uint16 widthOffset = 0;
    bool foundLand = false;
    for(uint8 t = 0;t<tileIndex;t++){
      widthOffset+=landLib.translateTileToWidth(tileTypeAt[_x][_y][t]);
      if(tileTypeAt[_x][_y][t]!=0&&!foundLand){
        foundLand=true;
        widthOffset+=114;
      }else if(tileTypeAt[_x][_y][t]==0&&foundLand){
        foundLand=false;
        widthOffset+=114;
      }
    }
    if(!foundLand){
      widthOffset+=114;
    }
    widthOffset = widthOffset+(landLib.translateTileToWidth(tileTypeAt[_x][_y][tileIndex])/2);

    uint16 halfTotalWidth = totalWidth[_x][_y]/2;
    return 2000 - halfTotalWidth + widthOffset;
  }

  function findTile(uint16 _x,uint16 _y,uint16 _lookingForType) public constant returns (uint8) {
    uint8 index = 0;
    while(tileTypeAt[_x][_y][index]!=_lookingForType){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

  function findTileByAddress(uint16 _x,uint16 _y,address _address) public constant returns (uint8) {
    uint8 index = 0;
    while(contractAt[_x][_y][index]!=_address){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

}

contract LandLib {
  mapping (bytes32 => uint16) public tileTypes;
  function translateTileToWidth(uint16 _tileType) public constant returns (uint16) { }
  function translateToStartingTile(uint16 tilepart) public constant returns (uint16) { }
}

contract StandardToken {
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
}

contract StandardTile {
  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) { }
}
