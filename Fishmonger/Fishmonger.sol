pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Fishmonger buys fish from players for Copper. It then butchers the fish
  to produce Fillets. When a fish is butchered, it is actually restocked into
  the Sea for other players to catch.

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract Fishmonger is Galleasset, HasNoEther {

  function Fishmonger(address _galleass) public Galleasset(_galleass) { }

  //how much the fishmonger is willing to pay for each species of fish
  mapping (address => uint256) public price;

  uint256 public filletPrice = 1;

  function setPrice(address _species,uint256 _price) onlyOwner public returns (bool) {
    assert( _species != address(0) );
    price[_species]=_price;
  }

  function sellFish(address _species,uint256 _amount) public isGalleasset("Fishmonger") returns (bool) {
    require( _species != address(0) );
    uint256 fishPrice = price[_species];
    require( fishPrice>0 );
    StandardToken fishContract = StandardToken(_species);
    require( fishContract.galleassTransferFrom(msg.sender,address(this),_amount) );

    //RESTOCK THE SEA WITH THE ORIGINAL FISH (not zero sum obviously because fillets will also be produced, the sea continues to produce fish to make fillets forever)
    address seaContractAddress = getContract("Sea");
    Sea seaContract = Sea(seaContractAddress);
    require( fishContract.approve(seaContractAddress,_amount) );
    require( seaContract.stock(_species,_amount) );

    //CONVERT THE FISH TO FILLETS (THE fishmonger then sells fillets for citizen food in later levels)
    StandardToken filletContract = StandardToken(getContract("Fillet"));
    require( filletContract.galleassMint(address(this),5) ); //for now just create 4 fillets for every fish but eventually make it dynamic, different fish will butcher different

    //SEND THEM price[_species]*_amount COPPER FOR THE FISH
    address copperContractAddress = getContract("Copper");
    StandardToken copperContract = StandardToken(copperContractAddress);
    require( copperContract.transfer(msg.sender,fishPrice*_amount) );

    updateExperience(msg.sender);

    return true;
  }

  function buyFillet(uint256 _amount) public isGalleasset("Fishmonger") returns (bool) {
    address filletAddress = getContract("Fillet");
    require(filletAddress != address(0));
    require(filletPrice != 0);

    StandardToken filletContract = StandardToken(filletAddress);
    require(_amount <= filletContract.balanceOf(address(this)));

    address copperContractAddress = getContract("Copper");
    StandardToken copperContract = StandardToken(copperContractAddress);
    require( copperContract.transferFrom(msg.sender, address(this), _amount*filletPrice ));

    require( filletContract.transfer(msg.sender,_amount) );

    return true;
  }

  function updateExperience(address _player) internal returns (bool){
    address experienceContractAddress = getContract("Experience");
    require( experienceContractAddress!=address(0) );
    Experience experienceContract = Experience(experienceContractAddress);
    experienceContract.update(_player,3,true);//milestone 3: Sell Fish for Copper
  }

  function withdrawToken(address _token,uint256 _amount) public onlyOwner isBuilding returns (bool) {
    StandardToken token = StandardToken(_token);
    token.transfer(msg.sender,_amount);
    return true;
  }

}

contract Sea{
  function stock(address _species,uint256 _amount) public returns (bool) { }
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
