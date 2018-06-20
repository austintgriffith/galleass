pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

// adapted from https://github.com/ethereum/EIPs/issues/677
//    big thanks to Steve Ellis

contract ERC677Token is StandardToken {

  event Transfer(address indexed from, address indexed to, uint value, bytes data);

  function transferAndCall(address _to, uint _value, bytes _data)
    public
    validRecipient(_to)
    returns (bool success)
  {
    super.transfer(_to, _value);
    emit Transfer(msg.sender, _to, _value, _data);
    if (isContract(_to)) {
      contractFallback(_to, _value, _data);
    }
    return true;
  }
  function contractFallback(address _to, uint _value, bytes _data)
    validRecipient(_to)
    private
  {
    ERC677Receiver receiver = ERC677Receiver(_to);
    require(receiver.onTokenTransfer(msg.sender, _value, _data));
  }

  function isContract(address _addr)
    private
    returns (bool hasCode)
  {
    uint length;
    assembly { length := extcodesize(_addr) }
    return length > 0;
  }


  modifier validRecipient(address _recipient) {
    require(_recipient != address(0) && _recipient != address(this));
    _;

  }

}

contract ERC677Receiver {
  function onTokenTransfer(address _sender, uint _value, bytes _data) returns (bool){}
}
