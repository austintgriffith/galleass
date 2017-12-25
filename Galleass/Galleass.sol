pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'zeppelin-solidity/contracts/ownership/Contactable.sol';
import 'Staged.sol';
import 'Predecessor.sol';

contract Galleass is Staged, HasNoEther, Contactable, Predecessor{

  event SetContract(bytes32 name,address contractAddress,address whoDid);
  event SetPermission(address account,bytes32 permission,bool value);

  mapping(bytes32 => address) contracts;
  mapping(address => mapping(bytes32 => bool)) permission;

  function Galleass(string _contact) public { setContactInformation(_contact); }

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


  function test() public returns (bool) {
    //approve(address _spender, uint256 _value)
    getContract("Timber").call(bytes4(sha3("approve(address,uint256)")),address(this),99);
  }


}
