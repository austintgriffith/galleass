pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Land contract tracks all the procedurally generated islands in Galleass.

  Tiles can be purchased and built upon.

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract LandLib is Galleasset, Ownable {

  mapping (bytes32 => uint16) public tileTypes;

  function LandLib(address _galleass) public Galleasset(_galleass) {
    //this is mainly just for human reference and to make it easier to track tiles mentally
    //it's expensive and probably won't be included in production contracts
    tileTypes["Water"]=0;

    tileTypes["MainHills"]=1;
    tileTypes["MainGrass"]=2;
    tileTypes["MainStream"]=3;

    tileTypes["Grass"]=50;
    tileTypes["Forest"]=51;
    tileTypes["Mountain"]=52;
    tileTypes["CopperMountain"]=53;
    tileTypes["SilverMountain"]=54;

    tileTypes["Harbor"]=100;
    tileTypes["Fishmonger"]=101;
    tileTypes["Market"]=102;

    tileTypes["TimberCamp"]=150;

    tileTypes["Village"]=2000;
  }
  function () public {revert();}

  function setTileType(uint16 _tile,bytes32 _name) onlyOwner isBuilding public returns (bool) {
    tileTypes[_name] = _tile;
  }

  //erc677 receiver
  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("LandLib") returns (bool) {
    TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==1){
      return buyTile(_sender,_amount,_data);
    } else if(action==2){
      return buildTimberCamp(_sender,_amount,_data);
    }
    return false;
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  function buyTile(address _sender, uint _amount, bytes _data) internal returns (bool) {
    Land landContract = Land(getContract("Land"));
    address copperContractAddress = getContract("Copper");
    require(msg.sender == copperContractAddress);
    uint16 _x = uint16(_data[1]) << 8 | uint16(_data[2]);
    uint16 _y = uint16(_data[3]) << 8 | uint16(_data[4]);
    uint8 _tile = uint8(_data[5]);
    //must be for sale
    require(landContract.priceAt(_x,_y,_tile)>0);
    //must send at least enough as the price
    require(_amount>=landContract.priceAt(_x,_y,_tile));
    //transfer the copper to the Land Owner
    StandardToken copperContract = StandardToken(copperContractAddress);
    require(copperContract.transfer(landContract.ownerAt(_x,_y,_tile),_amount));
    //set the new owner to the sender
    landContract.setOwnerAt(_x,_y,_tile,_sender);
    //when a piece of land is purchased, an "onPurchase" function is called
    // on the contract to help the inner contract track events and owners etc
    if(landContract.contractAt(_x,_y,_tile)!=address(0)){
      StandardTile tileContract = StandardTile(landContract.contractAt(_x,_y,_tile));
      tileContract.onPurchase(_x,_y,_tile,landContract.ownerAt(_x,_y,_tile),landContract.priceAt(_x,_y,_tile));
    }
    //clear the price so it isn't for sale anymore
    landContract.setPriceAt(_x,_y,_tile,0);
    return true;
  }

  function buildTimberCamp(address _sender, uint _amount, bytes _data) internal returns (bool) {
    Land landContract = Land(getContract("Land"));
    //build timber camp
    address copperContractAddress = getContract("Copper");
    require(msg.sender == copperContractAddress);
    uint16 _x = uint16(_data[1]) << 8 | uint16(_data[2]);
    uint16 _y = uint16(_data[3]) << 8 | uint16(_data[4]);
    uint8 _tile = uint8(_data[5]);

    //they must own the tile
    require(landContract.ownerAt(_x,_y,_tile)==_sender);
    //they must send in 6 copper
    require(_amount>=6);
    //move that copper to the Land contract
    StandardToken copperContract = StandardToken(copperContractAddress);
    require(copperContract.transfer(getContract("Land"),_amount));
    //must be built on a forest tile
    require(landContract.tileTypeAt(_x,_y,_tile)==tileTypes["Forest"]);


    //assuming the we used the fist 6 bytes of the data for action,x,y,tile we will use the rest as the id of
    // the citizen that will be building the timber camp
    uint citizenId = uint(getRemainingBytes(6,_data));
    //make sure that this address owns a citizen at this location with strength and stamina > 1
    // if everything is right, set the status to timber camp
    require(useCitizenAsLumberjack(_sender,_x,_y,_tile,citizenId));

    //set new tile type
    landContract.setTileTypeAt(_x,_y,_tile,tileTypes["TimberCamp"]);

    //Debug(getContract("TimberCamp"));
    //set contract to timber camp
    landContract.setContractAt(_x,_y,_tile,getContract("TimberCamp"));
    StandardTile tileContract = StandardTile(landContract.contractAt(_x,_y,_tile));
    tileContract.onPurchase(_x,_y,_tile,landContract.ownerAt(_x,_y,_tile),landContract.priceAt(_x,_y,_tile));

    return true;
  }
  //event Debug(bytes32 citizenBytes,uint8 b,uint8 d, bytes32 thisByte);
  event Debug(address TimberCamp);

  function useCitizenAsLumberjack(address _sender, uint16 _x, uint16 _y, uint8 _tile,uint _citizen) internal constant returns (bool){
    Citizens citizensContract = Citizens(getContract("Citizens"));
    address owner;
    uint8 status;
    uint16 x;
    uint16 y;
    uint8 tile;
    bytes32 characteristics;
    (owner,status,,x,y,tile,,characteristics,) = citizensContract.getToken(_citizen);
    //sender must own citizen
    require(owner==_sender);
    //citizen must be idle
    require(status==1);
    //citizen must be at location
    require(_x==x);
    require(_y==y);
    require(_tile==tile);
    //citizen must have enough strength and stamina to be a lumberjack
    uint16 strength;
    uint16 stamina;
    (strength,stamina,,,,,) = citizensContract.getCitizenBaseCharacteristics(_citizen);
    require(strength>1);
    require(stamina>1);
    //set citizen status to TimberCamp tile type (lumberjack!)
    require(citizensContract.setStatus(_citizen,uint8(tileTypes["TimberCamp"])));
    return true;
  }


  function getRemainingBytes(uint8 _offset, bytes _data) internal constant returns (bytes32 newBytes){
    uint8 b = 31;
    uint8 d = uint8(_data.length-1);
    while(d>_offset-1){
      newBytes |= bytes32(_data[d--] & 0xFF) >> (b-- * 8);
    }
    return newBytes;
  }

  function translateTileToWidth(uint16 _tileType) public constant returns (uint16) {
    if(_tileType==tileTypes["Water"]){
      return 95;
    }else if (_tileType>=1&&_tileType<50){
      return 120;
    }else if (_tileType>=50&&_tileType<100){
      return 87;
    }else if (_tileType>=100&&_tileType<150){
      return 120;
    }else if (_tileType>=150&&_tileType<200){
      return 87;
    }else{
      return 120;
    }
  }

  function translateToStartingTile(uint16 tilepart) public constant returns (uint16) {
    if(tilepart<12850){
      return tileTypes["Water"];
    }else if(tilepart<19275){
      return tileTypes["MainHills"];
    }else if(tilepart<24415){
      return tileTypes["MainGrass"];
    }else if(tilepart<26985){
      return tileTypes["MainStream"];
    }else if(tilepart<40606){
      return tileTypes["Grass"];
    }else if(tilepart<59624){
      return tileTypes["Forest"];
    }else if(tilepart<64250){
      return tileTypes["Mountain"];
    }else if(tilepart<65287){
      return tileTypes["CopperMountain"];
    }else{
      return tileTypes["SilverMountain"];
    }
  }

}

contract Citizens {
  function setStatus(uint _id,uint8 _status) returns (bool) { }
  function getCitizenBaseCharacteristics(uint256 _id) public view returns (uint16 strength,uint16 stamina,uint16 dexterity,uint16 intelligence,uint16 ambition,uint16 rigorous,uint16 industrious) { }
  function getToken(uint256 _id) public view returns (address owner,uint8 status,uint data,uint16 x,uint16 y,uint8 tile, bytes32 genes,bytes32 characteristics,uint64 birth) { }
}

contract Land {
  uint16 public mainX;
  uint16 public mainY;
  uint256 public nonce=0;
  mapping (bytes32 => uint16) public tileTypes;
  mapping (uint16 => mapping (uint16 => uint16[18])) public tileTypeAt;
  mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
  mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
  mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;
  mapping (uint16 => mapping (uint16 => uint16)) public totalWidth;
  function setTileTypeAt(uint16 _x, uint16 _y, uint8 _tile,uint16 _type) public returns (bool) { }
  function setContractAt(uint16 _x, uint16 _y, uint8 _tile,address _address) public returns (bool) { }
  function setOwnerAt(uint16 _x, uint16 _y, uint8 _tile,address _owner) public returns (bool) { }
  function setPriceAt(uint16 _x, uint16 _y, uint8 _tile,uint _price) public returns (bool) { }
}

contract StandardToken {
  function transfer(address _to, uint256 _value) public returns (bool) { }
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
}

contract StandardTile {
  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) { }
}
