pragma solidity ^0.4.15;

contract Ships is CraftableToken {

    string public constant name = "Galleass Ship";
    string public constant symbol = "G_SHIP";
    uint32 BLOCKSTOBUILD = 3;

    function Ships() public { }

    struct Ship{
      address controller;
      uint16 location;
      bool direction;
      bool building;
      bool floating;
      bool sailing;
      uint16 speed;
      uint64 birth;
    }

    Ship[] ships;

    function _createShip(address _owner, uint16 _location, uint16 _speed, bool _direction) internal returns (uint){
        Ship memory _ship = Ship({
          controller: msg.sender,
          location: _location,
          direction: _direction,
          building: true,
          floating: false,
          sailing: false,
          speed: _speed,
          birth: uint64(now)
        });
        uint256 newShipId = ships.push(_ship) - 1;
        require(newShipId == uint256(uint32(newShipId)));
        Birth(_owner,newShipId,_location,_direction);
        _transfer(0, _owner, newShipId);
        return newShipId;
    }
    event Birth(address owner, uint256 shipId, uint16 location, bool direction);

    function totalSupply() public view returns (uint) {
        return ships.length - 1;
    }

    function shipsOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 total = totalSupply();
            uint256 resultIndex = 0;
            uint256 id;
            for (id = 1; id <= total; id++) {
                if (tokenIndexToOwner[id] == _owner) {
                    result[resultIndex] = id;
                    resultIndex++;
                }
            }
            return result;
        }
    }
}


// --------------------------------------------------------------------------- Dependencies

import 'CraftableToken.sol';

contract StandardToken {
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) { }
  function transfer(address _to, uint256 _value) public returns (bool) { }
}
