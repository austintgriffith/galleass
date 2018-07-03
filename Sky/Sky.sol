pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Sky contains events for the sky like clouds

*/

import 'Galleasset.sol';

contract Sky is Galleasset {

  constructor(address _galleass) public Galleasset(_galleass) { }

  function addCloud(uint16 _x, uint16 _y, uint16 _location,uint8 _speed,uint8 _image) onlyOwner public returns (bool) {
    Cloud(_x,_y,_location,_speed,_image,uint64(block.number));
  }

  event Cloud(uint16 indexed x,uint16 indexed y,uint16 location,uint8 speed,uint8 image,uint64 block);

}
