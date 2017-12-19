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
    Ships shipsContract = Ships(shipsContractAddress);
    uint256 availableShip = getShipFromStorage(shipsContract,model);
    require( availableShip!=0 );
    shipsContract.transfer(msg.sender,availableShip);
    return availableShip;
  }

  function setPrice(Ships.Model model,uint256 amount) public onlyOwner returns (bool) {
    currentPrice[uint256(model)]=amount;
  }

  function getShipFromStorage(Ships shipsContract, Ships.Model model) internal returns (uint256) {
    uint256 index = 0;
    while(index<shipStorage.length){
      if(shipStorage[index]!=0 && shipsContract.getShipModel(shipStorage[index])==model){
        uint256 shipId = shipStorage[index];
        shipStorage[index]=0;
        return shipId;
      }
      index++;
    }
    return 0;
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

  function getBalance() public view returns (uint256) {
    return this.balance;
  }

}

contract Ships {
  enum Model{
    FISHING
  }
  function buildShip(Model model) public returns (uint) { }
  function transfer(address _to,uint256 _tokenId) external { }
  function getShipModel(uint256 _id) public view returns (Model) { }
}
