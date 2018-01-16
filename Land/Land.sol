pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Land is Galleasset, Ownable {

  uint8[18] public tiles;//this is the 0-255 different available icons 0:water 1:grass 10:harbor etc
  address[18] public contracts;//any given tile could have a contract attached to it

  function Land(address _galleass) public Galleasset(_galleass) {
    bytes memory tileparts = toBytes(address(this));
    for(uint8 index = 0; index < 18; index++){
      tiles[index] = translateToStartingTile(uint8(tileparts[index]));
    }

    //scan tiles and insert base spots
    uint8 landCount = 0;
    for(uint8 landex = 0; landex < 18; landex++){
      if(tiles[landex]==0){
        if(landCount>0){
          //right edge,
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
  event Debug(uint8 _index,bytes1 _bytes,uint8 _number);

  function translateToStartingTile(uint8 tilepart) internal constant returns (uint8) {
    if(tilepart<50){
      return 0; //WATER TILE
    }else if(tilepart<135){
      return 2; //GRASS TILE
    }else if(tilepart<225){
      return 3; //FOREST TILE
    }else if(tilepart<250){
      return 4; //MOUNTAIN TILE
    }else if(tilepart<254){
      return 5; //COPPER MOUNTAIN TILE
    }else{
      return 6; //SILVER MOUNTAIN TILE
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
