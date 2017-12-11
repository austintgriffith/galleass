pragma solidity ^0.4.15;
contract Predecessor is Ownable{
    function Predecessor() {}
    address public descendant;
    function setDescendant(address _descendant) onlyOwner public {
      descendant=_descendant;
    }
    modifier hasNoDescendant() {
      require(descendant == address(0));
      _;
    }
}
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
