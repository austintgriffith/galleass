pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Sea enables seaworth ships to travel from one island to another

*/

import 'Galleasset.sol';

contract Sea is Galleasset {

  constructor(address _galleass) public Galleasset(_galleass) { }

  uint8 updateNonce = 0;
  event ShipUpdate(uint256 timestamp,uint256 id,address contractAddress,address indexed owner,bool floating,bool sailing,uint16 indexed x,uint16 indexed y,uint16 location,uint16 destX,uint16 destY,uint16 destLocation,uint16 destBlock);
  function emitShipUpdate(address _contract, uint _shipId,address _owner,Ship thisShip) internal {
    emit ShipUpdate(now,_shipId,_contract,_owner,thisShip.floating,thisShip.sailing,thisShip.x,thisShip.y,thisShip.location,thisShip.destX,thisShip.destY,thisShip.destLocation,thisShip.destBlock);
  }

  struct Ship{
    uint256 id;
    address contractAddress;
    address owner;
    bool floating;
    bool sailing;
    uint16 x;
    uint16 y;
    uint16 location;
    uint16 destX;
    uint16 destY;
    uint16 destLocation;
    uint16 destBlock;
  }

  //      ship contract      //ship id
  mapping(address => mapping(uint => Ship)) public ships;

  //
  // put a ship into the sea
  //
  function embark(address _contract, uint256 _shipId, uint16 _x, uint16 _y, uint16 _location) public isGalleasset("Sea") returns (bool) {
    //cant already be floating
    require( !ships[_contract][_shipId].floating );
    //make sure calling contract has permission to put the ship into the sea
    require(hasPermission(msg.sender,"embarkShips"));

    //initialize the ship storage
    Ship storage thisShip = ships[_contract][_shipId];
    thisShip.id = _shipId;
    thisShip.contractAddress = _contract;
    thisShip.floating=true;
    thisShip.sailing=false;
    thisShip.x=_x;
    thisShip.y=_y;
    thisShip.location=_location;

    NFT shipContract = NFT(_contract);
    address owner = shipContract.ownerOf(_shipId);

    emitShipUpdate(_contract,_shipId,owner,thisShip);
    return true;
  }


/*
  //
  // transfer your ship back to you from the bay
  //
  function disembark(uint16 _x, uint16 _y,uint256 shipId) public isGalleasset("Bay") returns (bool) {
    //make sure the ship for this address is the same id they passed in
    require( ships[_x][_y][msg.sender].id==shipId );
    // make sure the ship is floating
    require( ships[_x][_y][msg.sender].floating );
    //make sure they are in range to disembark
    require( inRangeToDisembark(_x,_y,msg.sender) );
    //transfer the ship back to the address
    NFT shipsContract = NFT(getContract("Dogger"));
    require( shipsContract.ownerOf(shipId)==address(this) );
    shipsContract.galleassetTransferFrom(address(this),msg.sender,shipId);
    require( shipsContract.ownerOf(shipId)==msg.sender );

    //delete the ship from Bay memory
    uint256 deletedId = ships[_x][_y][msg.sender].id;
    Ship thisShip = ships[_x][_y][msg.sender];
    thisShip.floating=false;
    thisShip.sailing=false;
    emit ShipUpdate(_x,_y,deletedId,msg.sender,now*1000+(updateNonce++),thisShip.floating,thisShip.sailing,thisShip.direction,thisShip.fishing,thisShip.blockNumber,thisShip.location);

    delete ships[_x][_y][msg.sender];
    return true;
  }




  //
  // sail east (true) or west (false)
  //
  function setSail(uint16 _x, uint16 _y,bool direction) public isGalleasset("Bay") returns (bool) {

    Ship thisShip = ships[_x][_y][msg.sender];

    //ship must be floating but not fishing or sailing
    require( thisShip.floating );
    require( !thisShip.fishing );
    require( !thisShip.sailing );

    thisShip.sailing=true;
    thisShip.blockNumber=uint64(block.number);
    thisShip.direction=direction;

    emitShipUpdate(_x,_y,thisShip);
    return true;
  }


  //
  // drop anchor to stop the ship
  //
  function dropAnchor(uint16 _x, uint16 _y) public isGalleasset("Bay") returns (bool) {

    Ship thisShip = ships[_x][_y][msg.sender];

    require( thisShip.floating );
    require( thisShip.sailing );

    thisShip.location = shipLocation(_x,_y,msg.sender);
    thisShip.blockNumber = uint64(block.number);
    thisShip.sailing = false;

    emitShipUpdate(_x,_y,thisShip);
    return true;
  }



  // --------------------------------------------------------------------------- GETTERS

  function getShip(uint16 _x, uint16 _y,address _address) public constant returns (
    uint256 id,
    bool floating,
    bool sailing,
    bool direction,
    bool fishing,
    uint64 blockNumber,
    uint16 location
  ) {
    uint16 loc = shipLocation(_x,_y,_address);
    Ship thisShip = ships[_x][_y][_address];
    return(
      thisShip.id,
      thisShip.floating,
      thisShip.sailing,
      thisShip.direction,
      thisShip.fishing,
      thisShip.blockNumber,
      loc
    );
  }



  //
  // location of fish is based on their id
  //
  function fishLocation(bytes32 id) public constant returns(uint16,uint16) {
    bytes16[2] memory parts = [bytes16(0), 0];
        assembly {
            mstore(parts, id)
            mstore(add(parts, 16), id)
        }
    return (uint16(uint(parts[0]) % width),uint16(uint(parts[1]) % depth));
  }

  //
  // location of a moving ship is calculated based on blocks since it set sail
  //
  function shipLocation(uint16 _x, uint16 _y,address _owner) public constant returns (uint16) {

    Ship thisShip = ships[_x][_y][_owner];

    if(!thisShip.sailing){
      return thisShip.location;
    }else{
      uint256 blocksTraveled = block.number - thisShip.blockNumber;
      uint256 pixelsTraveled = blocksTraveled * shipSpeed;
      uint16 location;
      if( thisShip.direction ){
        location = thisShip.location + uint16(pixelsTraveled);
      } else {
        location = thisShip.location - uint16(pixelsTraveled);
      }
      return location;
    }
  }

  function inRangeToDisembark(uint16 _x, uint16 _y,address _account) public constant returns (bool) {
    //if it's not floating, no need to check
    if(ships[_x][_y][_account].location==0 || !ships[_x][_y][_account].floating) return false;
    //get the location of the harbor
    uint16 harborLocation = getHarborLocation(_x,_y);
    //check distance to harbor
    if(ships[_x][_y][_account].location >= harborLocation){
      return ((ships[_x][_y][_account].location-harborLocation) < 3000);
    }else{
      return ((harborLocation-ships[_x][_y][_account].location) < 3000);
    }
  }

  function getHarborLocation(uint16 _x, uint16 _y) public constant returns (uint16) {
    Land landContract = Land(getContract("Land"));
    //uint16 harborLocation = landContract.getTileLocation(landContract.mainX(),landContract.mainY(),getContract("Harbor"));
    uint16 harborLocation = landContract.getTileLocation(_x,_y,getContract("Harbor"));
    return uint16((65535 * uint256(harborLocation)) / 4000);
  }

  */

}

contract NFT {
  function ownerOf(uint256 _tokenId) external view returns (address owner) { }
}

/*
contract Land {
  uint16 public mainX;
  uint16 public mainY;
  function getTileLocation(uint16 _x,uint16 _y,address _address) public constant returns (uint16) { }
  function findTileByAddress(uint16 _x,uint16 _y,address _address) public constant returns (uint8) { }
}



contract StandardToken {
  bytes32 public image;
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
}

contract Experience{
  function update(address _player,uint16 _milestone,bool _value) public returns (bool) { }
}*/
