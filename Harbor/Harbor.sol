pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Harbor is Galleasset, Ownable {

  uint256[20] public shipStorage;
  uint256[1] public currentPrice;

  function Harbor(address _galleass) public Galleasset(_galleass) {
    currentPrice[uint256(Ships.Model.FISHING)] = (1 ether)/1000;
  }

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

  modifier enoughValue(Ships.Model model){
    require( msg.value >= currentPrice[uint256(model)] );
    _;
  }

  function buyShip(Ships.Model model) public payable enoughValue(model) returns (uint) {
    address shipsContractAddress = getContract("Ships");
    if(model==Ships.Model.FISHING){
      Ships shipsContract = Ships(shipsContractAddress);
      //  uint256 shipId = shipsContract.buildShip(model);
      //return shipId;
      return 1;
    }
    revert();
  }

  function setPrice(Ships.Model model,uint256 amount) public onlyOwner returns (bool) {
    currentPrice[uint256(model)]=amount;
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

  function withdraw(uint256 _amount) public onlyOwner returns (bool) {
    require(this.balance >= _amount);
    assert(owner.send(_amount));
    return true;
  }

}

contract Ships {
  enum Model{
    FISHING
  }
  function buildShip(Model model) public returns (uint) { }
  function transfer(address _to,uint256 _tokenId) external { }
}
