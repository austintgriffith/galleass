pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Village is where food is consumed and citizens are created

*/

import 'StandardTile.sol';

contract Village is StandardTile {

  constructor(address _galleass) public StandardTile(_galleass) { }

  function createCitizen(uint16 _x,uint16 _y,uint8 _tile) public isGalleasset("Village") isLandOwner(_x,_y,_tile) returns (uint) {
    CitizensLib citizensContract = CitizensLib(getContract("CitizensLib"));
    //eventually citizens will be created with better recipes but for now we just have fillets...
    return citizensContract.createCitizen(msg.sender,"Fillet","Fillet","Fillet",_x,_y,_tile);
  }

}

contract CitizensLib {
  function createCitizen(address owner, bytes32 food1, bytes32 food2, bytes32 food3, uint16 _x, uint16 _y, uint8 _tile) returns (uint){ }
}
