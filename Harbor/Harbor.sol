pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Harbor is where ships embark and disembark from the Sea. It is the first
  land tile to be built in the main Land. You can buy, sell, and build ships
  by allowing the transfer of Timber.

*/

import 'StandardTile.sol';

contract Harbor is StandardTile {

  uint16 public constant TIMBERTOBUILDDOGGER = 2;
  uint16 public constant TIMBERTOBUILDSCHOONER = 6;

  //      land x            land y          land tile           model      array of ids
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (bytes32 => uint256[99])))) public shipStorage; //make ship storage very large for testnet (eventually this should be much smaller)

  //      land x            land y          land tile           model      price to buy ship
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (bytes32 => uint256)))) public currentPrice;


  constructor(address _galleass) public StandardTile(_galleass) {
    //currentPrice["Dogger"] = ((1 ether)/1000);
  }

  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("Harbor") returns (bool){
    emit TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==0){
      return _sendToken(_sender,_amount,_data);
    } else if(action==1){
      return _build(_sender,_amount,_data);
    } else {
      revert("unknown action");
    }
    return true;
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);



  function _build(address _sender, uint _amount, bytes _data) internal returns (bool) {

    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);

    bytes32 _model = getRemainingBytesTrailingZs(6,_data);

    //you must be sending in timber
    require(msg.sender == getContract("Timber"));

    //you must own the tile
    require(_sender == landOwners[_x][_y][_tile]);

    if(_model=="Dogger"){
      //must send in enough timber to build
      require( _amount >= TIMBERTOBUILDDOGGER );
      require( _buildShip(_x,_y,_tile,_model) > 0);
      return true;
    }else if(_model=="Schooner"){
      //must send in enough timber to build
      require( _amount >= TIMBERTOBUILDSCHOONER );
      require( _buildShip(_x,_y,_tile,_model) > 0);
      return true;
    }else{
      return false;
    }
    return true;
  }

  //this is really only used for the scripts that build doggers
  // I should carve this out and only use transfer and call because it is confusing to have two different build functions
  function buildShip(uint16 _x,uint16 _y,uint8 _tile,bytes32 _model) public isGalleasset("Harbor") isLandOwner(_x,_y,_tile) returns (uint) {
    if(_model=="Dogger"){
      require( getTokens(msg.sender,"Timber",TIMBERTOBUILDDOGGER) );
      return _buildShip(_x,_y,_tile,_model);
    }else if(_model=="Schooner"){
      require( getTokens(msg.sender,"Timber",TIMBERTOBUILDSCHOONER) );
      return _buildShip(_x,_y,_tile,_model);
    }else{
      return 0;
    }
  }

  function _buildShip(uint16 _x,uint16 _y,uint8 _tile,bytes32 _model) internal returns (uint) {
    address shipsContractAddress = getContract(_model);
    require( shipsContractAddress!=address(0) );
    if(_model=="Dogger"){
      require( approveTokens("Timber",shipsContractAddress,TIMBERTOBUILDDOGGER) );
    }else if(_model=="Schooner"){
      require( approveTokens("Timber",shipsContractAddress,TIMBERTOBUILDSCHOONER) );
    }else{
      return 0;
    }
    NFT shipContract = NFT(shipsContractAddress);
    uint256 shipId = shipContract.build();
    require( storeShip(_x,_y,_tile,shipId,_model) );
    return shipId;
  }

  //this is old code, but it looks like you can sell ships back to the harbor
  // it also looks like you only get 9/10s of the price back if you sell it
  // I was probably just playing around with how ether moves around differently
  // than the native erc20s
  /*function sellShip(uint256 shipId,bytes32 model) public isGalleasset("Harbor") returns (bool) {
    address shipsContractAddress = getContract(model);
    require( shipsContractAddress!=address(0) );
    require( currentPrice[model] > 0 );
    NFT shipsContract = NFT(shipsContractAddress);
    require( shipsContract.ownerOf(shipId) == msg.sender);
    shipsContract.transferFrom(msg.sender,address(this),shipId);
    require( shipsContract.ownerOf(shipId) == address(this));
    require( storeShip(shipId,model) );
    uint256 buyBackAmount = currentPrice[model] * 9;
    buyBackAmount = buyBackAmount / 10;
    return msg.sender.send(buyBackAmount);
  }*/

  function buyShip(uint16 _x,uint16 _y,uint8 _tile,bytes32 model) public payable isGalleasset("Harbor") returns (uint) {
    require( currentPrice[_x][_y][_tile][model] > 0 );
    require( msg.value >= currentPrice[_x][_y][_tile][model] );
    address shipsContractAddress = getContract(model);
    require( shipsContractAddress!=address(0) );
    NFT shipsContract = NFT(shipsContractAddress);
    uint256 availableShip = getShipFromStorage(_x,_y,_tile,shipsContract,model);
    require( availableShip!=0 );
    shipsContract.transfer(msg.sender,availableShip);

    address experienceContractAddress = getContract("Experience");
    require( experienceContractAddress!=address(0) );
    Experience experienceContract = Experience(experienceContractAddress);
    require( experienceContract.update(msg.sender,1,true) );//milestone 1: buy ship

    return availableShip;
  }

  //the land owner can adjust the price in Eth that players have to pay for a ship
  function setPrice(uint16 _x,uint16 _y,uint8 _tile,bytes32 model,uint256 amount) public isLandOwner(_x,_y,_tile) returns (bool) {
    currentPrice[_x][_y][_tile][model]=amount;
  }


  // Internal functions dealing with ship/memory storage --- ////////////////////////////////////////////////////////////

  function getShipFromStorage(uint16 _x,uint16 _y,uint8 _tile,NFT shipsContract, bytes32 model) internal returns (uint256) {
    uint256 index = 0;
    while(index<shipStorage[_x][_y][_tile][model].length){
      if(shipStorage[_x][_y][_tile][model][index]!=0){
        uint256 shipId = shipStorage[_x][_y][_tile][model][index];
        shipStorage[_x][_y][_tile][model][index]=0;
        return shipId;
      }
      index++;
    }
    return 0;
  }

  function storeShip(uint16 _x,uint16 _y,uint8 _tile,uint256 _shipId,bytes32 _model) internal returns (bool) {
    uint256 index = 0;
    while(index<shipStorage[_x][_y][_tile][_model].length){
      if(shipStorage[_x][_y][_tile][_model][index]==0){
        shipStorage[_x][_y][_tile][_model][index]=_shipId;
        return true;
      }
      index++;
    }
    return false;
  }

  function countShips(uint16 _x,uint16 _y,uint8 _tile,bytes32 _model) public constant returns (uint256) {
    uint256 count = 0;
    uint256 index = 0;
    while(index<shipStorage[_x][_y][_tile][_model].length){
      if(shipStorage[_x][_y][_tile][_model][index]!=0){
        count++;
      }
      index++;
    }
    return count;
  }

}

contract StandardToken {
  function transfer(address _to, uint256 _value) public returns (bool) { }
}

contract NFT {
  function build() public returns (uint) { }
  function transfer(address _to,uint256 _tokenId) external { }
  function transferFrom(address _from,address _to,uint256 _tokenId) external { }
  function ownerOf(uint256 _tokenId) external view returns (address owner) { }
}

contract Experience{
  function update(address _player,uint16 _milestone,bool _value) public returns (bool) { }
}
