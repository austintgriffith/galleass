pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  IPFS contract is used to track deployments

*/

import 'Galleasset.sol';

contract Ipfs is Galleasset {

  constructor(address _galleass) public Galleasset(_galleass) { }

  string public ipfs;

  function setIpfs(string _ipfs) public isGalleasset("Ipfs") onlyOwner returns (bool) {
    ipfs=_ipfs;
    emit Update(msg.sender,ipfs,now);
    return true;
  }

  event Update(address _sender,string _ipfs,uint _timestamp);

}
