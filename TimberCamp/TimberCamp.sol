pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Timber Camp produces Timber depending on mined block hashes
  this Timber can be collected by the Tile owner
*/

import 'StandardTile.sol';

contract TimberCamp is StandardTile {

  constructor(address _galleass) public StandardTile(_galleass) { }

  bytes2 public min = 0x0001;
  bytes2 public max = 0x0666; // 2.4% chance? 1 out of evyer 46 or so? should be about 1 every 10 minutes?

  uint8 public maxCollect = 8;
  bytes32 public resource = "Timber";

  //keep track of the last block they pulled resources so you know what is available
  mapping(uint16 => mapping(uint16 => mapping(uint8 => uint64))) public lastBlock;

  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) {
    require(StandardTile.onPurchase(_x,_y,_tile,_owner,_amount));
    lastBlock[_x][_y][_tile] = uint64(block.number);
    return true;
  }

  function collect(uint16 _x,uint16 _y,uint8 _tile) public isGalleasset("TimberCamp") isLandOwner(_x,_y,_tile) returns (bool) {
    uint8 amount = canCollect(_x,_y,_tile);
    StandardToken resourceContract = StandardToken(getContract(resource));
    require(resourceContract.galleassMint(msg.sender,amount));
    lastBlock[_x][_y][_tile] = uint64(block.number);
    return true;
  }


  function canCollect(uint16 _x,uint16 _y,uint8 _tile) public constant returns (uint8 amount) {
    amount=0;
    uint16 minNumber = uint16(min);
    uint16 maxNumber = uint16(max);
    uint64 currentBlock = uint16(block.number);
    while(currentBlock >= lastBlock[_x][_y][_tile]){
      bytes32 blockHash = block.blockhash(currentBlock);
      uint16 hashNumber = uint16(blockHash[0]) << 8 | uint16(blockHash[1]);
      if(hashNumber >= minNumber && hashNumber <= maxNumber){
        amount++;
        if(amount>=maxCollect) return maxCollect;
      }
      currentBlock=currentBlock-1;
    }
    return amount;
  }
}

contract StandardToken {
  function galleassMint(address _to,uint _amount) public returns (bool) { }
}
