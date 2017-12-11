pragma solidity ^0.4.15;

contract Sea is Staged, Predecessor, HasNoEther {

  function Sea() public { }

  uint16 public width = 65535; //pixels
  uint16 public depth = 65535; //pixels
  uint256 public shipSpeed = 256; //pixels per block
  uint256 nonce;

  mapping (address => Ship) public ships;
  mapping (bytes32 => address) public fish;
  mapping (address => bool) public species;

  struct Ship{
    bool floating;
    bool sailing;
    bool direction; //true: east (+), false: west (-)
    bool fishing;
    uint32 block;
    uint16 location;
    //when you cast, it is after a specific fish with a certain bait hash
    bytes32 bait;
    bytes32 fish;
  }

  // --------------------------------------------------------------------------- BUILD

  function addCloud(uint16 _location,uint8 _speed,uint8 _image) isBuilding onlyOwner public returns (bool) {
    Cloud(_location,_speed,_image,uint32(block.number));
  }
  event Cloud(uint16 location,uint8 speed,uint8 image,uint32 block);

  function allowSpecies(address _species) isBuilding onlyOwner public returns (bool) {
    assert( _species != address(0) );
    species[_species]=true;
  }

  // --------------------------------------------------------------------------- SETTERS

  //
  // stock the sea with a specific species
  //
  function stock(address _species,uint256 _amount) isNotPaused hasNoDescendant public returns (bool) {
    require( _species != address(0) );
    require( species[_species] );
    StandardToken fishContract = StandardToken(_species);
    require( fishContract.transferFrom(msg.sender,address(this),_amount) );
    while(_amount-->0){
      bytes32 id = keccak256(nonce++,block.blockhash(block.number-1),msg.sender);
      require(fish[id]==address(0));
      fish[id] = _species;
      Fish(id,now,fish[id]);
    }
    return true;
  }
  event Fish(bytes32 id, uint256 timestamp, address species);

  //
  // 'borrow' a fishing ship
  //
  function embark() isNotPaused hasNoDescendant public returns (bool) {
    require(!ships[msg.sender].floating);
    ships[msg.sender].floating=true;
    ships[msg.sender].sailing=false;
    ships[msg.sender].location=width/2;
    ships[msg.sender].block=uint32(block.number);
    ships[msg.sender].direction=false;

    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    return true;
  }

  //
  // sail east (true) or west (false)
  //
  function setSail(bool direction) isNotPaused hasNoDescendant public returns (bool) {
    require( ships[msg.sender].floating );
    require( !ships[msg.sender].fishing );
    require( !ships[msg.sender].sailing );

    ships[msg.sender].sailing=true;
    ships[msg.sender].block=uint32(block.number);
    ships[msg.sender].direction=direction;

    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    return true;
  }

  //
  // drop anchor to stop the ship
  //
  function dropAnchor() isNotPaused hasNoDescendant public returns (bool) {
    require( ships[msg.sender].floating );
    require( ships[msg.sender].sailing );

    ships[msg.sender].location = shipLocation(msg.sender);
    ships[msg.sender].block = uint32(block.number);
    ships[msg.sender].sailing = false;

    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    return true;
  }

  //
  // bait the hook and cast the line
  //
  function castLine(bytes32 baitHash) isNotPaused hasNoDescendant public returns (bool) {
    require( ships[msg.sender].floating );
    require( !ships[msg.sender].sailing );
    require( !ships[msg.sender].fishing );

    ships[msg.sender].fishing = true;
    ships[msg.sender].block = uint32(block.number);
    ships[msg.sender].bait = baitHash;

    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    Debug(ships[msg.sender].block, block.blockhash(ships[msg.sender].block), block.blockhash(ships[msg.sender].block-1));

    return true;
  }
  event Debug(uint32 block, bytes32 blockhash, bytes32 previousblockhash);


  //
  //  try to catch a fish with your bait
  //
  function reelIn(bytes32 _fish, bytes32 bait) isNotPaused hasNoDescendant public returns (bool) {
    require( ships[msg.sender].floating );
    require( ships[msg.sender].fishing );
    require( block.number > ships[msg.sender].block);//must be next block after so we have a new block hash
    require( species[fish[_fish]] );//make sure fish exists and is valid species
    require( keccak256(bait) == ships[msg.sender].bait);//make sure their off-chain bait == onchain hash

    Debug(ships[msg.sender].block, block.blockhash(ships[msg.sender].block), block.blockhash(ships[msg.sender].block-1));

    ships[msg.sender].fishing = false;
    ShipUpdate(msg.sender,now,ships[msg.sender].floating,ships[msg.sender].sailing,ships[msg.sender].direction,ships[msg.sender].fishing,ships[msg.sender].block,ships[msg.sender].location);

    if(catchFish(_fish,bait)){
      assert( fish[_fish]!=address(0) );
      address fishContractAddress = fish[_fish];
      fish[_fish] = address(0);
      StandardToken thisFishContract = StandardToken(fishContractAddress);
      require( thisFishContract.transfer(msg.sender,1) );
      Catch(msg.sender,_fish,fishContractAddress);
      Fish(_fish, now, fish[_fish]);
      return true;
    }else{
      return false;
    }
  }
  event Catch(address account, bytes32 fish, address species);

  //
  // SCUTTLE THAT SUMMA B!
  //
  function scuttle() isNotPaused hasNoDescendant public returns(bool) {
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
  event ShipUpdate(address sender,uint timestamp,bool floating,bool sailing,bool direction,bool fishing,uint32 block,uint16 location);

  // --------------------------------------------------------------------------- GETTERS

  function getShip(address _address) public constant returns (
    bool floating,
    bool sailing,
    bool direction,
    bool fishing,
    uint32 block,
    uint16 location
  ) {
    return(
      ships[_address].floating,
      ships[_address].sailing,
      ships[_address].direction,
      ships[_address].fishing,
      ships[_address].block,
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
      uint256 blocksTraveled = block.number - ships[_owner].block;
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
    bytes32 catchHash = keccak256(msg.sender,bait,block.blockhash(ships[msg.sender].block));
    bytes32 depthHash = keccak256(msg.sender,bait,catchHash,block.blockhash(ships[msg.sender].block-1));
    uint randomishWidthNumber = uint16( uint(catchHash) % width/10 );
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

// --------------------------------------------------------------------------- Dependencies

import 'Predecessor.sol';
import 'Staged.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract StandardToken {
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
}
