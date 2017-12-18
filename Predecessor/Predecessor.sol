pragma solidity ^0.4.15;
contract Predecessor is Ownable, Staged{
    function Predecessor() public {}
    address public descendant;
    function setDescendant(address _descendant) onlyOwner isNotProduction public {
      descendant=_descendant;
    }
    modifier hasNoDescendant() {
      require(descendant == address(0));
      _;
    }
}
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'Staged.sol';
