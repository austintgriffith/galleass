pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract Fishmonger is Galleasset, HasNoEther {

  function Fishmonger(address _galleass) public Galleasset(_galleass) { }

  //how much the fishmonger is willing to pay for each species of fish
  mapping (address => uint256) public price;

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

    return true;
  }
  //event Debug(address _sender,address _species,uint256 _amount,bool _permission);
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
}
