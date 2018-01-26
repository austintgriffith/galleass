pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Land is Galleasset, Ownable {

  uint16 public mainX;
  uint16 public mainY;

  function setMainLocation(uint16 _mainX,uint16 _mainY) onlyOwner isBuilding public returns (bool) {
    mainX=_mainX;
    mainY=_mainY;
  }

  uint256 public nonce=0;

  mapping (bytes32 => uint8) public tileTypes;

  mapping (uint16 => mapping (uint16 => uint8[18])) public tileTypeAt;
  mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
  mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
  mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;

  function Land(address _galleass) public Galleasset(_galleass) {
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

    tileTypes["TimberCamp"]=150;

    tileTypes["Village"]=200;
  }

  function generateLand() onlyOwner isBuilding public returns (bool) {

    //islands are procedurally generated based on a randomish hash
    bytes32 id = keccak256(nonce++,block.blockhash(block.number-1));
    uint16 x = uint16(id[18]) << 8 | uint16(id[19]);
    uint16 y = uint16(id[20]) << 8 | uint16(id[21]);
    //don't allow land at 0's (those are viewed as empty)
    if(x==0) x=1;
    if(y==0) y=1;

    for(uint8 index = 0; index < 18; index++){
      tileTypeAt[x][y][index] = translateToStartingTile(uint8(id[index]));
      ownerAt[x][y][index] = msg.sender;
    }

    //scan tiles and insert base spots
    uint8 landCount = 0;
    for(uint8 landex = 0; landex < 18; landex++){
      if(tileTypeAt[x][y][landex]==0){
        if(landCount>0){
          //right edge
          tileTypeAt[x][y][landex-(landCount%2+landCount/2)]=1;//MAIN TILE
          landCount=0;
        }
      }else{
        if(landCount==0){
          //left edge
        }
        landCount++;
      }
    }
    if(landCount>0){
      //final right edge
      tileTypeAt[x][y][17-(landCount/2)]=1; //MAIN TILE
      landCount=0;
    }

    if(mainX==0||mainY==0){
      mainX=x;
      mainY=y;
    }

    LandGenerated(x,y);
  }
  event LandGenerated(uint16 _x,uint16 _y);

  function setTileType(uint8 _tile,bytes32 _name) onlyOwner isBuilding public returns (bool) {
    tileTypes[_name] = _tile;
  }

  function editTile(uint16 _x, uint16 _y,uint8 _tile,uint8 _update,address _contract) onlyOwner isBuilding public returns (bool) {
    tileTypeAt[_x][_y][_tile] = _update;
    contractAt[_x][_y][_tile] = _contract;
  }

  function buildTile(uint16 _x, uint16 _y,uint8 _tile,uint8 _newTileType) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    uint8 tileType = tileTypeAt[_x][_y][_tile];

    if(tileType==tileTypes["MainHills"]||tileType==tileTypes["MainGrass"]){
      //they want to build on a main, blank spot wither hills or grass
      if(_newTileType==tileTypes["Village"]){

        return true;
      }else{
        return false;
      }
    } else {
      return false;
    }
  }

  function buyTile(uint16 _x,uint16 _y,uint8 _tile) public isGalleasset("Land") returns (bool) {
    require(priceAt[_x][_y][_tile]>0);//must be for sale
    address copperContractAddress = getContract("Copper");
    StandardToken copperContract = StandardToken(copperContractAddress);
    require(copperContract.transferFrom(msg.sender,ownerAt[_x][_y][_tile],priceAt[_x][_y][_tile]));

    ownerAt[_x][_y][_tile]=msg.sender;
    priceAt[_x][_y][_tile]=0;
    return true;
  }

  function setPrice(uint16 _x,uint16 _y,uint8 _tile,uint256 _price) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    priceAt[_x][_y][_tile]=_price;
    return true;
  }

  function setTileContract(uint16 _x,uint16 _y,uint8 _tile,address _contract) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    contractAt[_x][_y][_tile]=_contract;
    return true;
  }

  function transferTile(uint16 _x,uint16 _y,uint8 _tile,address _newOwner) public isGalleasset("Land") returns (bool) {
    require(msg.sender==ownerAt[_x][_y][_tile]);
    ownerAt[_x][_y][_tile]=_newOwner;
    priceAt[_x][_y][_tile]=0;
    return true;
  }

  function getTileLocation(uint16 _x,uint16 _y,address _address) public constant returns (uint16) {
    uint8 tileIndex = findTileByAddress(_x,_y,_address);
    if(tileIndex==255) return 0;
    uint16 widthOffset = 0;
    bool foundLand = false;
    for(uint8 t = 0;t<tileIndex;t++){
      widthOffset+=translateTileToWidth(tileTypeAt[_x][_y][t]);
      if(tileTypeAt[_x][_y][t]!=0&&!foundLand){
        foundLand=true;
        widthOffset+=114;
      }else if(tileTypeAt[_x][_y][t]==0&&foundLand){
        foundLand=false;
        widthOffset+=114;
      }
    }
    if(!foundLand){
      widthOffset+=114;
    }
    widthOffset = widthOffset+(translateTileToWidth(tileTypeAt[_x][_y][tileIndex])/2);

    uint16 halfTotalWidth = getTotalWidth(_x,_y)/2;
    return 2000 - halfTotalWidth + widthOffset;
  }

  function getTotalWidth(uint16 _x,uint16 _y) public constant returns (uint16){
    uint16 totalWidth = 0;
    bool foundLand = false;
    for(uint8 t = 0;t<18;t++){
      totalWidth+=translateTileToWidth(tileTypeAt[_x][_y][t]);
      if(tileTypeAt[_x][_y][t]!=0&&!foundLand){
        foundLand=true;
        totalWidth+=114;
      }else if(tileTypeAt[_x][_y][t]==0&&foundLand){
        foundLand=false;
        totalWidth+=114;
      }
    }
    if(foundLand) totalWidth+=114;
    return totalWidth;
  }

  function findTile(uint16 _x,uint16 _y,uint8 _number) public constant returns (uint8) {
    uint8 index = 0;
    while(tileTypeAt[_x][_y][index]!=_number){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

  function findTileByAddress(uint16 _x,uint16 _y,address _address) public constant returns (uint8) {
    uint8 index = 0;
    while(contractAt[_x][_y][index]!=_address){
      index++;
      if(index>=18) return 255;
    }
    return index;
  }

  function translateTileToWidth(uint8 _tile) public constant returns (uint16) {
    if(_tile==tileTypes["Water"]){
      return 95;
    }else if (_tile>=1&&_tile<50){
      return 120;
    }else if (_tile>=50&&_tile<100){
      return 87;
    }else if (_tile>=100&&_tile<150){
      return 120;
    }else if (_tile>=150&&_tile<200){
      return 87;
    }else{
      return 120;
    }
  }

  function translateToStartingTile(uint8 tilepart) internal constant returns (uint8) {
    if(tilepart<50){
      return tileTypes["Water"];
    }else if(tilepart<75){
      return tileTypes["MainHills"];
    }else if(tilepart<95){
      return tileTypes["MainGrass"];
    }else if(tilepart<105){
      return tileTypes["MainStream"];
    }else if(tilepart<158){
      return tileTypes["Grass"];
    }else if(tilepart<232){
      return tileTypes["Forest"];
    }else if(tilepart<250){
      return tileTypes["Mountain"];
    }else if(tilepart<254){
      return tileTypes["CopperMountain"];
    }else{
      return tileTypes["SilverMountain"];
    }
  }

}

contract StandardToken {
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
}
