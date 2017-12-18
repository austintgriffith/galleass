pragma solidity ^0.4.15;

import 'Galleasset.sol';

contract Harbor is Galleasset {

  uint256[2] public shipStorage;

  function Harbor(address _galleass) Galleasset(_galleass) public { }

  function buildShip(Ships.Model model) public returns (uint) {
    address shipsContractAddress = getContract("Ships");
    if(model==Ships.Model.FISHING){
      require( getTokens(msg.sender,"Timber",2) );
      require( approveTokens("Timber",shipsContractAddress,2) );
      Ships shipsContract = Ships(shipsContractAddress);
      uint256 shipId = shipsContract.buildShip(model);
      require( storeShip(shipId) );
      return shipId;
    }
    revert();
  }

  function buyShip(Ships.Model model) public payable returns (uint) {
    address shipsContractAddress = getContract("Ships");
    if(model==Ships.Model.FISHING){
      //require( msg.value >  );
      //  Ships shipsContract = Ships(shipsContractAddress);
      //  uint256 shipId = shipsContract.buildShip(model);
      //return shipId;
    }
    revert();
  }


  function storeShip(uint256 _shipId) internal returns (bool) {
    uint256 index = 0;
    while(index<shipStorage.length){
      if(shipStorage[index]==0){
        shipStorage[index]=_shipId;
        return true;
      }
      index++;
    }
    return false;
  }

}

contract Ships {
  enum Model{
    FISHING
  }
  function buildShip(Model model) public returns (uint) { }
  function transfer(address _to,uint256 _tokenId) external { }
}
