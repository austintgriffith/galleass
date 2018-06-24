pragma solidity ^0.4.15;

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
