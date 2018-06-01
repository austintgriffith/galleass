pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Village is where food is consumed and citizens are created
*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TimberCamp is Galleasset, Ownable {

  /* right now the village contract represents all of the villages but
    it has a single land owner and inventory
    it could easily have an array to track who is the land owner where,
    but it might be trickier to have and inventory of every village
    maybe not, maybe it's just 677ed in, you transfer the Fillet and
    then call a function on the village that increments the inventory
    for a specific village
  */

  bytes2 public min = 0x0001;
  bytes2 public max = 0x7FFF;

  uint8 maxCollect = 8;
  bytes32 public resource = "Timber";

  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => address))) public landOwners;

  //keep track of the last block they pulled resources so you know what is available to
  mapping(uint16 => mapping(uint16 => mapping(uint8 => uint64))) public lastBlock;

  function TimberCamp(address _galleass) public Galleasset(_galleass) { }
  function () public {revert();}

  function onTokenTransfer(address _sender, uint _amount, bytes _data) isGalleasset("Village") returns (bool){
    return false;
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  function collect(uint16 _x,uint16 _y,uint8 _tile) public returns (bool) {
    //must be the owner of the tile
    require(msg.sender==landOwners[_x][_y][_tile]);
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
  event Debug(uint16 _x,uint16 _y,uint8 _tile,uint64 _block,bytes32 _hash);
  //standard tile interface
  //called when tile is purchased from Land contract
  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) {
    landOwners[_x][_y][_tile] = _owner;
    lastBlock[_x][_y][_tile] = uint64(block.number);
  }

  function withdraw(uint256 _amount) public onlyOwner isBuilding returns (bool) {
    require(this.balance >= _amount);
    assert(owner.send(_amount));
    return true;
  }
  function withdrawToken(address _token,uint256 _amount) public onlyOwner isBuilding returns (bool) {
    StandardToken token = StandardToken(_token);
    token.transfer(msg.sender,_amount);
    return true;
  }
}

contract StandardToken {
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function galleassMint(address _to,uint _amount) public returns (bool) { }
}
