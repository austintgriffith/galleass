pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Harbor is where ships embark and disembark from the Sea. It is the first
  land tile to be built in the main Land. You can buy, sell, and build ships
  by allowing the transfer of Timber.

*/

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Harbor is Galleasset, Ownable {

  mapping (bytes32 => uint256[99]) public shipStorage;
  mapping (bytes32 => uint256) public currentPrice;

  function Harbor(address _galleass) public Galleasset(_galleass) {
    currentPrice["Dogger"] = ((1 ether)/1000)*3;
  }

  function onTokenTransfer(address _sender, uint _value, bytes _data) {
    if( msg.sender == getContract("Timber") ){
      TokensIncoming("Timber",_sender,_value,_data);
    }else{
      revert();
    }
  }
  event TokensIncoming(bytes32 _contract,address _sender,uint _value, bytes _data);

  function buildShip(bytes32 model) public isGalleasset("Harbor") returns (uint) {
    if(model=="Dogger"){
      require( getTokens(msg.sender,"Timber",2) );
      return _buildShip(model);
    }
    revert();
  }

  function _buildShip(bytes32 model) internal returns (uint) {
    address shipsContractAddress = getContract(model);
    require( shipsContractAddress!=address(0) );
    require( approveTokens("Timber",shipsContractAddress,2) );
    NFT shipContract = NFT(shipsContractAddress);
    uint256 shipId = shipContract.build();
    require( storeShip(shipId,model) );
    return shipId;
  }

  function sellShip(uint256 shipId,bytes32 model) public isGalleasset("Harbor") returns (bool) {
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
  }

  modifier enoughValue(bytes32 model){
    require( currentPrice[model] > 0 );
    require( msg.value >= currentPrice[model] );
    _;
  }

  function buyShip(bytes32 model) public payable isGalleasset("Harbor") enoughValue(model) returns (uint) {
    address shipsContractAddress = getContract(model);
    require( shipsContractAddress!=address(0) );
    NFT shipsContract = NFT(shipsContractAddress);
    uint256 availableShip = getShipFromStorage(shipsContract,model);
    require( availableShip!=0 );
    shipsContract.transfer(msg.sender,availableShip);
    return availableShip;
  }

  function setPrice(bytes32 model,uint256 amount) public onlyOwner isBuilding returns (bool) {
    currentPrice[model]=amount;
  }

  function getShipFromStorage(NFT shipsContract, bytes32 model) internal returns (uint256) {
    uint256 index = 0;
    while(index<shipStorage[model].length){
      if(shipStorage[model][index]!=0){
        uint256 shipId = shipStorage[model][index];
        shipStorage[model][index]=0;
        return shipId;
      }
      index++;
    }
    return 0;
  }

  function storeShip(uint256 _shipId,bytes32 _model) internal returns (bool) {
    uint256 index = 0;
    while(index<shipStorage[_model].length){
      if(shipStorage[_model][index]==0){
        shipStorage[_model][index]=_shipId;
        return true;
      }
      index++;
    }
    return false;
  }

  //assuming this is more like a tip jar while building, you can pull out ether
  //in the long run the eth used to buy a ship is meant to pay
  //the ship builder for their citizens' time and timber used to build
  // -- instead of pulling out ether it should be used to support the internal economy
  function withdraw(uint256 _amount) public onlyOwner isBuilding returns (bool) {
    require(this.balance >= _amount);
    assert(owner.send(_amount));
    return true;
  }

  function getBalance() public view returns (uint256) {
    return this.balance;
  }

}


contract NFT {
  function build() public returns (uint) { }
  function transfer(address _to,uint256 _tokenId) external { }
  function transferFrom(address _from,address _to,uint256 _tokenId) external { }
  function ownerOf(uint256 _tokenId) external view returns (address owner) { }
}
