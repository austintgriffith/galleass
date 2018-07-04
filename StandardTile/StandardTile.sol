pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  A standard tile has mapping for land owners and inventory hodl/send etc
*/

import 'Galleasset.sol';
import 'DataParser.sol';

contract StandardTile is Galleasset, DataParser{

  constructor(address _galleass) public Galleasset(_galleass) { }
  function () public {revert();}

  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => address))) public landOwners;

  //each tile will have an inventory of tokens
  //      land x            land y          land tile         //token address //amount
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping(address => uint256)))) public tokenBalance;

  //standard tile interface
  //called when tile is purchased from Land contract
  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) {
    require(msg.sender==getContract("Land") || msg.sender==getContract("LandLib"));
    landOwners[_x][_y][_tile] = _owner;
    emit LandOwner(_x,_y,_tile,_owner);
    return true;
  }
  event LandOwner(uint16 _x,uint16 _y,uint8 _tile,address _owner);

  modifier isLandOwner(uint16 _x,uint16 _y,uint8 _tile) {
    require(msg.sender==landOwners[_x][_y][_tile]);
    _;
  }

  //the owner of the tile will need to stock it with copper to pay fishermen for their fillets
  function _sendToken(address _sender, uint _amount, bytes _data) internal returns (bool) {
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);
    _incrementTokenBalance(_x,_y,_tile,msg.sender,_amount);
    return true;
  }

  ///////internal helpers to keep stack thin enough//////////////////////////////////////////////////////////
  function _incrementTokenBalance(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) internal {
    tokenBalance[_x][_y][_tile][_token]+=_amount;
    require(tokenBalance[_x][_y][_tile][_token]>=_amount,"Overflow?");
  }
  function _decrementTokenBalance(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _amount) internal {
    require(tokenBalance[_x][_y][_tile][_token]>=_amount,"This tile does not have enough of this token");
    tokenBalance[_x][_y][_tile][_token]-=_amount;
  }
}
