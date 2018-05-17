pragma solidity ^0.4.15;

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Ipfs is Galleasset, Ownable {

  string public ipfs;

  function Ipfs(address _galleass) Galleasset(_galleass) public { }
  function () public {revert();}

  function setIpfs(string _ipfs) public isGalleasset("Ipfs") onlyOwner returns (bool) {
    ipfs=_ipfs;
    Update(msg.sender,ipfs);
    return true;
  }
  event Update(address _sender,string _ipfs);

}
