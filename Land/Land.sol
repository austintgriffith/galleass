pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Land is Galleasset, Ownable {

  uint8[18] public tiles;//this is the 0-255 different available icons 0:water 1:grass 100:harbor etc
  address[18] public contracts;//any given tile could have a contract attached to it
  address[18] public owner;
  uint256[18] public price;

  function Land(address _galleass) public Galleasset(_galleass) {
    //bytes memory tileparts = "0xf0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0";//use to test a bunch of islands
    bytes memory tileparts = toBytes(address(this));
    for(uint8 index = 0; index < 18; index++){
      tiles[index] = translateToStartingTile(uint8(tileparts[index]));
      owner[index] = msg.sender;
    }
    //scan tiles and insert base spots
    uint8 landCount = 0;
    for(uint8 landex = 0; landex < 18; landex++){
      if(tiles[landex]==0){
        if(landCount>0){
          //right edge
          tiles[landex-(landCount%2+landCount/2)]=1;//MAIN TILE
          landCount=0;
        }
      }else{
        if(landCount==0){
          //left edge
        }
        landCount++;
      }
    }
    if(landCount>0){
      //final right edge
      tiles[17-(landCount/2)]=1; //MAIN TILE
      landCount=0;
    }
  }

  function editTile(uint8 _tile,uint8 _update,address _contract) onlyOwner isBuilding public returns (bool) {
    tiles[_tile] = _update;
    contracts[_tile] = _contract;
  }

  function buyTile(uint8 _tile) public isGalleasset("Land") returns (bool) {
    require(price[_tile]>0);//must be for sale
    address copperContractAddress = getContract("Copper");
    StandardToken copperContract = StandardToken(copperContractAddress);
    require(copperContract.transferFrom(msg.sender,owner[_tile],price[_tile]));

    owner[_tile]=msg.sender;
    price[_tile]=0;
    return true;
  }

  function setPrice(uint8 _tile,uint256 _price) public isGalleasset("Land") returns (bool) {
    require(msg.sender==owner[_tile]);
    price[_tile]=_price;
    return true;
  }

  function getTileLocation(address _address) public constant returns (uint16) {
    uint8 tileIndex = findTileByAddress(_address);
    require(tileIndex!=255);
    uint16 widthOffset = 0;
    bool foundLand = false;
    for(uint8 t = 0;t<tileIndex;t++){
      widthOffset+=translateTileToWidth(tiles[t]);
      if(tiles[t]!=0&&!foundLand){
        foundLand=true;
        widthOffset+=114;
      }else if(tiles[t]==0&&foundLand){
        foundLand=false;
        widthOffset+=114;
      }
    }
    if(!foundLand){
      widthOffset+=114;
    }
    widthOffset = widthOffset+(translateTileToWidth(tiles[tileIndex])/2);

    uint16 halfTotalWidth = getTotalWidth()/2;
    return 2000 - halfTotalWidth + widthOffset;
  }

  function getTotalWidth() public constant returns (uint16){
    uint16 totalWidth = 0;
    bool foundLand = false;
    for(uint8 t = 0;t<18;t++){
      totalWidth+=translateTileToWidth(tiles[t]);
      if(tiles[t]!=0&&!foundLand){
        foundLand=true;
        totalWidth+=114;
      }else if(tiles[t]==0&&foundLand){
        foundLand=false;
        totalWidth+=114;
      }
    }
    if(foundLand) totalWidth+=114;
    return totalWidth;
  }

  function findTile(uint8 _number) public constant returns (uint8) {
    uint8 index = 0;
    while(tiles[index]!=_number){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

  function findTileByAddress(address _address) public constant returns (uint8) {
    uint8 index = 0;
    while(contracts[index]!=_address){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

  function translateTileToWidth(uint8 _tile) public constant returns (uint16) {
    if(_tile==0){
      return 95;
    }else if (_tile==1||_tile==2||_tile==3||_tile==100||_tile==101){
      return 120;
    }else if (_tile==50||_tile==51||_tile==52||_tile==53||_tile==54){
      return 87;
    }
  }

  function translateToStartingTile(uint8 tilepart) internal constant returns (uint8) {
    if(tilepart<50){
      return 0; //WATER TILE
    }else if(tilepart<75){
      return 1; //HILLS MAIN TILE
    }else if(tilepart<95){
      return 2; //GRASS MAIN TILE
    }else if(tilepart<105){
      return 3; //STREAM MAIN TILE
    }else if(tilepart<158){
      return 50; //GRASS TILE
    }else if(tilepart<232){
      return 51; //FOREST TILE
    }else if(tilepart<250){
      return 52; //MOUNTAIN TILE
    }else if(tilepart<254){
      return 53; //COPPER MOUNTAIN TILE
    }else{
      return 54; //SILVER MOUNTAIN TILE
    }
  }

  function toBytes(address a) internal constant returns (bytes b){
     assembly {
          let m := mload(0x40)
          mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
          mstore(0x40, add(m, 52))
          b := m
     }
  }

}

contract StandardToken {
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
}
