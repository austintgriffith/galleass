pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The CitizensLib contract extends the logic for Citizens
  

*/

import 'Galleasset.sol';

contract CitizensLib is Galleasset {

  uint8 nonce = 0;

  constructor(address _galleass) Galleasset(_galleass) public { }

  function ownerCreateCitizen(address owner,uint16 _x, uint16 _y, uint8 _tile,bytes32 genes, bytes32 characteristics) onlyOwner isBuilding public returns (uint){
    //function used at world build time to populate certain buildings like the fishmonger with a Citizen
    _createCitizen(owner,_x,_y,_tile,genes,characteristics);
  }

  function ownerSetStatus(uint _id,uint8 _status) onlyOwner isBuilding public returns (bool){
    Citizens citizensContract = Citizens(getContract("Citizens"));
    return citizensContract.setStatus(_id,_status);
  }

  //a citizen is created when food is provided to a village
  function createCitizen(address owner,uint16 _x, uint16 _y, uint8 _tile,bytes32 food1, bytes32 food2, bytes32 food3) public isGalleasset("CitizensLib") returns (uint){
    require(hasPermission(msg.sender,"createCitizens"));

    //eventually you will want to be able to use a standard contract interface

    bytes32 characteristics = _convertFoodToCharacteristics(owner,food1,food2,food3);

    //genes will at first be random but then maybe they will be mixed... like you might need
    //to not only have food, but a couple citizens in the village too and you would use
    //their existing genes to mix for the new genes
    bytes32 genes = keccak256(nonce++,block.blockhash(block.number-1));

    //internal function to reduce stack size
    _createCitizen(owner,_x,_y,_tile,genes,characteristics);
  }

  function _createCitizen(address owner,uint16 _x,uint16 _y,uint8 _tile,bytes32 genes,bytes32 characteristics) internal {
    Citizens citizensContract = Citizens(getContract("Citizens"));
    citizensContract.createCitizen(owner,1,0,_x,_y,_tile,genes,characteristics);
  }

  function _convertFoodToCharacteristics(address owner,bytes32 food1,bytes32 food2,bytes32 food3) internal returns (bytes32 characteristics){
    /*
    i went back and forth for a while trying to decide if you send the fillet to the village
    then, this contract pulls from there. It's really cool to see the village contract "inventory"
    BUT, if there is a contract for every village then it would need to be deployed as a new one is built
    this deployment would have to come from the builder and you would have to trust it...
    ...maybe that is okay? Maybe the bytecode could be compared or something...
    ..I think I've decided against that, I think it makes more sense to have one contract for all of the villages.
    */
    if(food1=="Fillet"&&food2=="Fillet"&&food3=="Fillet"){
      /*require( getTokens(msg.sender,food1,1) );
      require( getTokens(msg.sender,food2,1) );
      require( getTokens(msg.sender,food3,1) );*/
      require( getGalleassTokens(owner,"Fillet",3) );
      //for now there are only fillets, eventually a complex funtion will take in the food and output the characteristics
      characteristics = 0x0002000200000000000000000000000000000000000000000000000000000000;
    } else if(food1=="Greens"&&food2=="Fillet"&&food3=="Fillet"){
      /*require( getTokens(msg.sender,food1,1) );
      require( getTokens(msg.sender,food2,1) );
      require( getTokens(msg.sender,food3,1) );*/
      require( getGalleassTokens(owner,"Greens",1) );
      require( getGalleassTokens(owner,"Fillet",2) );
      //for now there are only fillets, eventually a complex funtion will take in the food and output the characteristics
                       // str|sta|dex|int|amb|rig|ind|ing|
      characteristics = 0x0001000200010005000100000000000100000000000000000000000000000000;
    }else{
      //unknown recipe
      revert();
    }

    return characteristics;
  }

  function getCitizenGenes(uint256 _id) public view returns (uint16 head,uint16 hair,uint16 eyes,uint16 nose,uint16 mouth) {
    Citizens citizensContract = Citizens(getContract("Citizens"));
    bytes32 genes;
    (,,,,,,genes,,) = citizensContract.getToken(_id);
    head = uint16(genes[0]) << 8 | uint16(genes[1]);
    hair = uint16(genes[2]) << 8 | uint16(genes[3]);
    eyes = uint16(genes[4]) << 8 | uint16(genes[5]);
    nose = uint16(genes[6]) << 8 | uint16(genes[7]);
    mouth = uint16(genes[8]) << 8 | uint16(genes[9]);
    return (head,hair,eyes,nose,mouth);
  }

  function getCitizenCharacteristics(uint256 _id) public view returns (uint16 strength,uint16 stamina,uint16 dexterity,uint16 intelligence,uint16 ambition,uint16 rigorousness,uint16 industriousness,uint16 ingenuity) {
    Citizens citizensContract = Citizens(getContract("Citizens"));
    bytes32 characteristics;
    (,,,,,,,characteristics,) = citizensContract.getToken(_id);
    strength = uint16(characteristics[0]) << 8 | uint16(characteristics[1]);
    stamina = uint16(characteristics[2]) << 8 | uint16(characteristics[3]);
    dexterity = uint16(characteristics[4]) << 8 | uint16(characteristics[5]);
    intelligence = uint16(characteristics[6]) << 8 | uint16(characteristics[7]);
    ambition = uint16(characteristics[8]) << 8 | uint16(characteristics[9]);
    rigorousness = uint16(characteristics[10]) << 8 | uint16(characteristics[11]);
    industriousness = uint16(characteristics[12]) << 8 | uint16(characteristics[13]);
    ingenuity = uint16(characteristics[14]) << 8 | uint16(characteristics[15]);
    return (strength, stamina, dexterity, intelligence, ambition, rigorousness, industriousness, ingenuity);
  }

  function getCitizenStatus(uint256 _id) public view returns (uint8 status,uint16 x, uint16 y, uint8 tile,uint data) {
    Citizens citizensContract = Citizens(getContract("Citizens"));
    (,status,data,x,y,tile,,,) = citizensContract.getToken(_id);
    return (status,x,y,tile,data);
  }

  function setStatus(uint _id,uint8 _status) public isGalleasset("CitizensLib") returns (bool){
    require(hasPermission(msg.sender,"useCitizens"));
    Citizens citizensContract = Citizens(getContract("Citizens"));
    return citizensContract.setStatus(_id,_status);
  }

  //citizens should be bought and sold for ether
  function setPrice(uint _id,uint _price) public isGalleasset("CitizensLib") returns (bool){
    Citizens citizensContract = Citizens(getContract("Citizens"));
    uint8 status;
    address owner;
    (owner,status,,,,,,,) = citizensContract.getToken(_id);
    //you must own the citizen to set its sale price
    require(owner==msg.sender);
    //the citizen must be idle or for sale to go on sale
    require(status==1||status==2);
    //is it currently for sale?
    if(_price==0){
      //setting the price to 0 means not for sale any more
      require(citizensContract.setStatus(_id,1));
    }else{
      //set status to 2 (for sale)
      require(citizensContract.setStatus(_id,2));
    }
    //set citizen data to the price
    require(citizensContract.setData(_id,_price));
    return true;
  }

  function moveCitizen(uint _id,uint8 _tile) public isGalleasset("CitizensLib") returns (bool) {
    Citizens citizensContract = Citizens(getContract("Citizens"));
    uint8 status;
    address owner;
    uint16 x;
    uint16 y;
    uint8 tile;
    (owner,status,,x,y,tile,,) = citizensContract.getToken(_id);
    //you must own the citizen to move them
    require(owner==msg.sender);
    //the citizen must be idle to move
    require(status==1);
    //you must own all the land between the current location and the destination
    //(bascially they will walk at the speed of light at first, but eventually
    // there should probably be some sort of transportation per island and it
    // takes a varying amount of time to move from tile to tile)
    Land landContract = Land(getContract("Land"));
    //first let's just make sure they own the dest and build the other stuff in
    //maybe it's fine for them to move anywhere on local islands at first idk
    //destination can't be water
    require(landContract.tileTypeAt(x,y,_tile)>0);
    //must own destination
    require(landContract.ownerAt(x,y,_tile)==msg.sender);
    //you can't already be at the destination
    require(tile!=_tile);
    //set the tile on the Citisen contract
    require(citizensContract.setTile(_id,_tile));
    return true;
  }
  event Debug(uint _id,uint8 _tile,uint8 status,address owner);

}

contract Land {
  mapping (uint16 => mapping (uint16 => uint16[18])) public tileTypeAt;
  mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
  mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
  mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;
  //function getTile(uint16 _x,uint16 _y,uint8 _index) public constant returns (uint16 _tile,address _contract,address _owner,uint256 _price) { }
}

contract Citizens {
    function createCitizen(address _owner,uint8 _status,uint _data,uint16 _x,uint16 _y, uint8 _tile, bytes32 _genes, bytes32 _characteristics) public returns (uint) { }
    function setStatus(uint _id,uint8 _status) public returns (bool) { }
    function setData(uint _id,uint _data) public returns (bool) { }
    function setTile(uint _id,uint8 _tile) public returns (bool) { }
    function getToken(uint256 _id) public view returns (address owner,uint8 status,uint data,uint16 x,uint16 y,uint8 tile, bytes32 genes,bytes32 characteristics,uint64 birth) { }
    function totalSupply() public view returns (uint) { }
}
