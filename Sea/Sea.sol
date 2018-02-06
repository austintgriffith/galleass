pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Sea contains fish and ships. Ships move east and west and cast their bait
  in an attempt to catch a fish. The Sea requires a harbor for embarking and
  disembarking.

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract Sea is Galleasset, HasNoEther {

  function Sea(address _galleass) public Galleasset(_galleass) { }

  uint16 public width = 65535; //pixels
  uint16 public depth = 65535; //pixels

  uint256 public shipSpeed = 512;///this will be replaced soon, each ship should have a different speed based on how it was crafted

  mapping (address => Ship) public ships;
  mapping (bytes32 => address) public fish;
  mapping (address => bool) public species;

  event ShipUpdate(uint256 id,address owner,uint timestamp,bool floating,bool sailing,bool direction,bool fishing,uint32 blockNumber,uint16 location);

  struct Ship{
    uint256 id;
    bool floating;
    bool sailing;
    bool direction; //true: east (+), false: west (-)
    bool fishing;
    uint32 blockNumber;
    uint16 location;
    //when you cast, it is after a specific fish with a certain bait hash
    bytes32 bait;
    bytes32 fish;
  }

  // --------------------------------------------------------------------------- BUILD

  function addCloud(uint16 _location,uint8 _speed,uint8 _image) onlyOwner public returns (bool) {
    Cloud(_location,_speed,_image,uint32(block.number));
  }
  event Cloud(uint16 location,uint8 speed,uint8 image,uint32 block);

  function allowSpecies(address _species) onlyOwner public returns (bool) {
    assert( _species != address(0) );
    species[_species]=true;
  }

  // --------------------------------------------------------------------------- SETTERS

  //
  // stock the sea with a specific species
  //
  uint256 nonce;
  function stock(address _species,uint256 _amount) public isGalleasset("Sea") returns (bool) {
    require( _species != address(0) );
    require( species[_species] );
    StandardToken fishContract = StandardToken(_species);
    require( fishContract.transferFrom(msg.sender,address(this),_amount) );
    while(_amount-->0){
      bytes32 id = keccak256(nonce++,block.blockhash(block.number-1),msg.sender);
      require(fish[id]==address(0));
      fish[id] = _species;
      Fish(id,now,fish[id],fishContract.image());
    }
    return true;
  }
  event Fish(bytes32 id, uint256 timestamp, address species, bytes32 image);



  //
  // transfer your ship to the sea to sail
  //
  function embark(uint256 shipId) public isGalleasset("Sea") returns (bool) {
    require( !ships[msg.sender].floating );
    NFT shipsContract = NFT(getContract("Dogger"));
    require( shipsContract.ownerOf(shipId)==msg.sender );
    shipsContract.galleassetTransferFrom(msg.sender,address(this),shipId);
    require( shipsContract.ownerOf(shipId)==address(this) );

    ships[msg.sender].id = shipId;
    ships[msg.sender].floating=true;
    ships[msg.sender].sailing=false;
    ships[msg.sender].location=getHarborLocation();
    ships[msg.sender].blockNumber=uint32(block.number);
    ships[msg.sender].direction=false;

    ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);

    return true;
  }

  //
  // transfer your ship back to you from the sea
  //
  function disembark(uint256 shipId) public isGalleasset("Sea") returns (bool) {
    require( ships[msg.sender].id==shipId );
    require( ships[msg.sender].floating );
    NFT shipsContract = NFT(getContract("Dogger"));
    require( shipsContract.ownerOf(shipId)==address(this) );
    shipsContract.galleassetTransferFrom(address(this),msg.sender,shipId);
    require( shipsContract.ownerOf(shipId)==msg.sender );

    require( inRangeToDisembark(msg.sender) );

    uint256 deletedId = ships[msg.sender].id;

    delete ships[msg.sender];

    ShipUpdate(deletedId,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);
    return true;
  }

  function getHarborLocation() public constant returns (uint16) {
    Land landContract = Land(getContract("Land"));
    uint16 harborLocation = landContract.getTileLocation(landContract.mainX(),landContract.mainY(),getContract("Harbor"));
    return uint16((65535 * uint256(harborLocation)) / 4000);
  }

  function inRangeToDisembark(address _account) public constant returns (bool) {
    if(ships[_account].location==0 || !ships[_account].floating) return false;
    uint16 harborLocation = getHarborLocation();
    if(ships[_account].location >= harborLocation){
      return ((ships[_account].location-harborLocation) < 3000);
    }else{
      return ((harborLocation-ships[_account].location) < 3000);
    }

  }

  //
  // sail east (true) or west (false)
  //
  function setSail(bool direction) public isGalleasset("Sea") returns (bool) {
    require( ships[msg.sender].floating );
    require( !ships[msg.sender].fishing );
    require( !ships[msg.sender].sailing );

    ships[msg.sender].sailing=true;
    ships[msg.sender].blockNumber=uint32(block.number);
    ships[msg.sender].direction=direction;

    ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);

    return true;
  }


  //
  // drop anchor to stop the ship
  //
  function dropAnchor() public isGalleasset("Sea") returns (bool) {
    require( ships[msg.sender].floating );
    require( ships[msg.sender].sailing );

    ships[msg.sender].location = shipLocation(msg.sender);
    ships[msg.sender].blockNumber = uint32(block.number);
    ships[msg.sender].sailing = false;

    ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);

    return true;
  }

  //
  // bait the hook and cast the line
  //
  function castLine(bytes32 baitHash) public isGalleasset("Sea") returns (bool) {
    require( ships[msg.sender].floating );
    require( !ships[msg.sender].sailing );
    require( !ships[msg.sender].fishing );

    ships[msg.sender].fishing = true;
    ships[msg.sender].blockNumber = uint32(block.number);
    ships[msg.sender].bait = baitHash;

    ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);

    return true;
  }

  //
  //  try to catch a fish with your bait
  //
  function reelIn(bytes32 _fish, bytes32 _bait) public isGalleasset("Sea") returns (bool) {
    require( ships[msg.sender].floating );
    require( ships[msg.sender].fishing );
    require( block.number > ships[msg.sender].blockNumber);//must be next block after so we have a new block hash
    if(_bait==0){
      //you can cut your line if you snag your bait
      // (if you lose the original bait that was used to produce the baithash you send 0x0 to cut the line)
      ships[msg.sender].fishing = false;
      ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);
      return false;
    }
    require( species[fish[_fish]] );//make sure fish exists and is valid species
    require( keccak256(_bait) == ships[msg.sender].bait);//make sure their off-chain bait == onchain hash

    ships[msg.sender].fishing = false;
    ShipUpdate(ships[msg.sender].id,msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].blockNumber,ships[msg.sender].location);

    if(catchFish(_fish,_bait)){
      assert( fish[_fish]!=address(0) );
      address fishContractAddress = fish[_fish];
      fish[_fish] = address(0);
      StandardToken thisFishContract = StandardToken(fishContractAddress);
      require( thisFishContract.transfer(msg.sender,1) );
      Catch(msg.sender,_fish,now,fishContractAddress);
      Fish(_fish, now, fish[_fish],thisFishContract.image());

      address experienceContractAddress = getContract("Experience");
      require( experienceContractAddress!=address(0) );
      Experience experienceContract = Experience(experienceContractAddress);
      experienceContract.update(msg.sender,2,true);//milestone 2: Catch a fish

      return true;
    }else{
      return false;
    }
  }
  event Catch(address account, bytes32 id, uint256 timestamp, address species);


  //
  // SCUTTLE THAT SUMMA B!
  //
  /*
  function scuttle() public returns(bool) {
    delete ships[msg.sender].id;
    delete ships[msg.sender].floating;
    delete ships[msg.sender].sailing;
    delete ships[msg.sender].direction;
    delete ships[msg.sender].fishing;
    delete ships[msg.sender].block;
    delete ships[msg.sender].location;
    delete ships[msg.sender].bait;

    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    delete ships[msg.sender];
  }
  */

  // --------------------------------------------------------------------------- GETTERS

  function getShip(address _address) public constant returns (
    uint256 id,
    bool floating,
    bool sailing,
    bool direction,
    bool fishing,
    uint32 blockNumber,
    uint16 location
  ) {
    return(
      ships[_address].id,
      ships[_address].floating,
      ships[_address].sailing,
      ships[_address].direction,
      ships[_address].fishing,
      ships[_address].blockNumber,
      shipLocation(_address)
    );
  }

  //
  // location of a moving ship is calculated based on blocks since it set sail
  //
  function shipLocation(address _owner) public constant returns (uint16) {
    if(!ships[_owner].sailing){
      return ships[_owner].location;
    }else{
      uint256 blocksTraveled = block.number - ships[_owner].blockNumber;
      uint256 pixelsTraveled = blocksTraveled * shipSpeed;
      uint16 location;
      if( ships[_owner].direction ){
        location = ships[_owner].location + uint16(pixelsTraveled);
      } else {
        location = ships[_owner].location - uint16(pixelsTraveled);
      }
      return location;
    }
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

  // --------------------------------------------------------------------------- Internal


  //
  // get some psuedo random numbers to decided if they catch the fish
  // they need to be close and it's hard if the fish is deeper
  //
  function catchFish(bytes32 _fish, bytes32 bait) internal returns (bool) {
    bytes32 catchHash = keccak256(bait,block.blockhash(ships[msg.sender].blockNumber));
    bytes32 depthHash = keccak256(bait,catchHash,block.blockhash(ships[msg.sender].blockNumber-1));
    uint randomishWidthNumber = uint16( uint(catchHash) % width/5 );
    uint depthPlus = depth;
    depthPlus+=depth/3;
    uint randomishDepthNumber =  uint(depthHash) % (depthPlus) ;

    uint16 fishx;
    uint16 fishy;
    (fishx,fishy) = fishLocation(_fish);

    uint16 distanceToFish = 0;
    if(ships[msg.sender].location > fishx){
      distanceToFish+=ships[msg.sender].location-fishx;
    }else{
      distanceToFish+=fishx-ships[msg.sender].location;
    }
    bool result = ( distanceToFish < randomishWidthNumber && fishy < randomishDepthNumber);
    Attempt(msg.sender,randomishWidthNumber, randomishDepthNumber, fishx, fishy, distanceToFish, result);
    return result;
  }
  event Attempt(address account,uint randomishWidthNumber,uint randomishDepthNumber,uint16 fishx,uint16 fishy,uint16 distanceToFish,bool result);

}

contract Land {
  uint16 public mainX;
  uint16 public mainY;
  function getTileLocation(uint16 _x,uint16 _y,address _address) public constant returns (uint16) { }
  function findTileByAddress(uint16 _x,uint16 _y,address _address) public constant returns (uint8) { }
}

contract NFT {
  function transferFrom(address _from,address _to,uint256 _tokenId) external { }
  function galleassetTransferFrom(address _from,address _to,uint256 _tokenId) external { }
  function ownerOf(uint256 _tokenId) external view returns (address owner) { }
}

contract StandardToken {
  bytes32 public image;
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
}

contract Experience{
  function update(address _player,uint16 _milestone,bool _value) public returns (bool) { }
}
