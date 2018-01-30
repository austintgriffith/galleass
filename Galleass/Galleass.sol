pragma solidity ^0.4.18;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Galleass contract contains a reference to all contracts in the fleet and
  provides a method of upgrading/replacing old contract versions.

  Galleass follows a Predecessor system where previous deployments of this
  contract will forward on to their decendants.

  Galleass contains an authentication system where contracts are allowed to do
  specific actions based on the permissions they are assigned.

  Finally, there is the notion of building, staging, and production modes. Once
  the contract is set to production, it is fully decentralized and not even the
  owner account can make changes.

*/


import 'zeppelin-solidity/contracts/ownership/Contactable.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'Staged.sol';
import 'Predecessor.sol';

contract Galleass is Staged, HasNoEther, Contactable, Predecessor{

  event UpgradeContract(address _contractAddress,address _descendant,address _whoDid);
  event SetContract(bytes32 _name,address _contractAddress,address _whoDid);
  event SetPermission(address _account,bytes32 _permission,bool _value);

  mapping(bytes32 => address) contracts;
  mapping(address => mapping(bytes32 => bool)) permission;

  function Galleass(string _contact) public { setContactInformation(_contact); }

  function upgradeContract(address _contract) onlyOwner isBuilding public returns (bool) {
    Galleasset(_contract).upgradeGalleass(descendant);
    UpgradeContract(_contract,descendant,msg.sender);
    return true;
  }

  function setContract(bytes32 _name,address _contract) onlyOwner isBuilding public returns (bool) {
    contracts[_name]=_contract;
    SetContract(_name,_contract,msg.sender);
    return true;
  }

  function setPermission(address _contract, bytes32 _permission, bool _value) onlyOwner isBuilding public returns (bool) {
    permission[_contract][_permission]=_value;
    SetPermission(_contract,_permission,_value);
    return true;
  }

  function getContract(bytes32 _name) public view returns (address) {
    if(descendant!=address(0)) {
      return Galleass(descendant).getContract(_name);
    }else{
      return contracts[_name];
    }
  }

  function hasPermission(address _contract, bytes32 _permission) public view returns (bool) {
    if(descendant!=address(0)) {
      return Galleass(descendant).hasPermission(_contract,_permission);
    }else{
      return permission[_contract][_permission];
    }
  }

}

contract Galleasset {
  function upgradeGalleass(address _galleass) public returns (bool) { }
}
