pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Castle (just a fancy version of the village for now) is where food is consumed and citizens are created

*/

import 'StandardTile.sol';

contract Castle is StandardTile {

  constructor(address _galleass) public StandardTile(_galleass) { }

  function createCitizen(uint16 _x,uint16 _y,uint8 _tile,bytes32 food1, bytes32 food2, bytes32 food3) public isGalleasset("Castle") isLandOwner(_x,_y,_tile) returns (uint) {
    //use an internal function because the stack is too deep
    return _createCitizen(_x,_y,_tile,food1,food2,food3);
  }

  function _createCitizen(uint16 _x,uint16 _y,uint8 _tile,bytes32 food1, bytes32 food2, bytes32 food3) internal returns (uint) {
    CitizensLib citizensContract = CitizensLib(getContract("CitizensLib"));
    return citizensContract.createCitizen(msg.sender,_x,_y,_tile,food1,food2,food3);
  }

}

contract CitizensLib {
  function createCitizen(address owner,uint16 _x, uint16 _y, uint8 _tile,bytes32 food1, bytes32 food2, bytes32 food3) returns (uint){ }
}
