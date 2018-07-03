pragma solidity ^0.4.23;

/*

https://galleass.io
by Austin Thomas Griffith

The Fishmonger buys fish from players for Copper. It then butchers the fish
to produce Fillets. When a fish is butchered, it is actually restocked into
the Sea for other players to catch.

*/

import 'StandardTile.sol';

contract Fishmonger is StandardTile {

  uint8 public constant FILLETSPERFISH = 4;

  constructor(address _galleass) public StandardTile(_galleass) { }

  //how much the fishmonger is willing to pay for each species of fish
  //      land x            land y          land tile           species    price
  mapping(uint16 => mapping(uint16 => mapping(uint8 => mapping (address => uint256)))) public price;

  //how much the fishmonger is selling fillets for
  //      land x            land y          land tile
  mapping(uint16 => mapping(uint16 => mapping(uint8 => uint256))) public filletPrice;


  function onPurchase(uint16 _x,uint16 _y,uint8 _tile,address _owner,uint _amount) public returns (bool) {
    require(super.onPurchase(_x,_y,_tile,_owner,_amount));
    //start fillet price at 3 automatically
    filletPrice[_x][_y][_tile] = 3;
    return true;
  }

  function setPrice(uint16 _x,uint16 _y,uint8 _tile,address _species,uint256 _price) public isGalleasset("Fishmonger") isLandOwner(_x,_y,_tile) returns (bool) {
    assert( _species != address(0) );
    price[_x][_y][_tile][_species]=_price;
  }

  function setFilletPrice(uint16 _x,uint16 _y,uint8 _tile,uint256 _price) public isGalleasset("Fishmonger") isLandOwner(_x,_y,_tile) returns (bool) {
    filletPrice[_x][_y][_tile]=_price;
  }

  function sellFish(uint16 _x,uint16 _y,uint8 _tile,address _species,uint256 _amount) public isGalleasset("Fishmonger") returns (bool) {
    //they supplied a species
    require( _species != address(0) );
    //this species has a sale price here
    uint256 fishPrice = _getFishPrice(_x,_y,_tile,_species);
    require( fishPrice>0 );
    //they are selling more than 0 fish
    require( _amount>0 );
    //take the fish even without approval because of permissions
    StandardToken fishContract = StandardToken(_species);
    require( fishContract.galleassTransferFrom(msg.sender,address(this),_amount) );
    //RESTOCK THE SEA WITH THE ORIGINAL FISH (not zero sum obviously because fillets will also be produced, the sea continues to produce fish to make fillets forever)
    _restockBay(fishContract,_x,_y,_species,_amount);
    //CONVERT THE FISH TO FILLETS (THE fishmonger then sells fillets for citizen food in later levels)
    StandardToken filletContract = StandardToken(getContract("Fillet"));
    require( filletContract.galleassMint(address(this),_amount*FILLETSPERFISH) ); //mint 1 fillet for each fish caught
    //each tile has a different inventory of fillets, increment it
    _incrementTokenBalance(_x,_y,_tile,getContract("Fillet"),_amount);

    //SEND THEM price[_species]*_amount COPPER FOR THE FISH
    address copperContractAddress = getContract("Copper");
    //each tile has a different inventory of copper, decrement it
    _decrementTokenBalance(_x,_y,_tile,copperContractAddress,fishPrice*_amount);
    StandardToken copperContract = StandardToken(copperContractAddress);
    require( copperContract.transfer(msg.sender,fishPrice*_amount) );


    _updateExperience(msg.sender);
    return true;
  }

  function _restockBay(StandardToken fishContract,uint16 _x,uint16 _y,address _species,uint256 _amount) internal {
    address bayContractAddress = getContract("Bay");
    Bay bayContract = Bay(bayContractAddress);
    require( fishContract.approve(bayContractAddress,_amount) );
    require( bayContract.stock(_x,_y,_species,_amount) );
  }

  function onTokenTransfer(address _sender, uint _amount, bytes _data) public isGalleasset("Fishmonger") returns (bool){
    emit TokenTransfer(msg.sender,_sender,_amount,_data);
    uint8 action = uint8(_data[0]);
    if(action==0){
      return _sendToken(_sender,_amount,_data);
    } else if(action==1){
      return _buyFillet(_sender,_amount,_data);
    } else if(action==2){
      //sellFish
    } else {
      revert("unknown action");
    }
  }
  event TokenTransfer(address token,address sender,uint amount,bytes data);

  //players will buy fillets to feed their citizens
  function _buyFillet(address _sender, uint _amount, bytes _data) internal returns (bool) {
    uint16 _x = getX(_data);
    uint16 _y = getY(_data);
    uint8 _tile = getTile(_data);
    require(msg.sender == getContract("Copper"),"Requires copper is sent in");
    address filletAddress = getContract("Fillet");
    require(filletAddress != address(0), "Fillet must have address");
    require(filletPrice[_x][_y][_tile] > 0, "Fillet must have a price");
    uint filletAmount = _amount / filletPrice[_x][_y][_tile];
    require(filletAmount>0,"Amount was too low?");
    //subtract amount from this tile's fillet balance
    _decrementTokenBalance(_x,_y,_tile,filletAddress,filletAmount);
    //increment the copper balance
    _incrementTokenBalance(_x,_y,_tile,msg.sender,_amount);
    //transfer fillets
    StandardToken filletContract = StandardToken(filletAddress);
    require(filletContract.transfer(_sender,filletAmount), "Failed to transfer fillets");
    return true;
  }

  ///////internal helpers to keep stack thin enough//////////////////////////////////////////////////////////
  function _getFishPrice(uint16 _x,uint16 _y,uint8 _tile,address _species) internal returns (uint256) {
    return  price[_x][_y][_tile][_species];
  }
  function _updateExperience(address _player) internal returns (bool){
    address experienceContractAddress = getContract("Experience");
    require( experienceContractAddress!=address(0) );
    Experience experienceContract = Experience(experienceContractAddress);
    experienceContract.update(_player,3,true);//milestone 3: Sell Fish for Copper
  }

}

  contract Bay{
    function stock(uint16 _x,uint16 _y,address _species,uint256 _amount) public returns (bool) { }
  }

  contract StandardToken {
    bytes32 public image;
    function approve(address _spender, uint256 _value) public returns (bool) { }
    function galleassMint(address _to, uint256 _amount) public returns (bool) { }
    function hasPermission(address _contract,bytes32 _permission) public view returns (bool){ }
    function galleassTransferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
    function transfer(address _to, uint256 _value) public returns (bool) { }
    function balanceOf(address _owner) public view returns (uint256 balance) { }
  }

  contract Experience{
    function update(address _player,uint16 _milestone,bool _value) public returns (bool) { }
  }
