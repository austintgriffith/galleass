pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Sea will soon be where seaworthy ships sail from one island to another

*/

import 'Galleasset.sol';

contract Sea is Galleasset {

  constructor(address _galleass) public Galleasset(_galleass) { }

}
