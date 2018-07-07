pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Dogger is the main fishing boat in Galleass.

*/

import 'Galleasset.sol';
import 'NFT.sol';

contract Galley is Galleasset, NFT {

    uint16 public constant TIMBERTOBUILDGALLEY = 5;

    string public constant name = "Galleass Galley";
    string public constant symbol = "G_GALLEY";

    constructor(address _galleass) Galleasset(_galleass) public {
      //0 index should be a blank item owned by no one
      uint[4] citizenStorage;
      uint[8] tokenStorage;
      Item memory _item = Item({
        strength: 0,
        speed: 0,
        luck: 0,
        birth: 0,
        citizenStorage: citizenStorage,
        tokenStorage: tokenStorage
      });
      items.push(_item);
    }
    function () public {revert();}

    struct Item{
      uint16 strength;
      uint16 speed;
      uint8 luck;
      uint64 birth;
      uint[4] citizenStorage;
      uint[8] tokenStorage;
    }

    Item[] private items;

    function build() public isGalleasset("Galley") returns (uint){
      require( hasPermission(msg.sender,"buildGallet") );
      require( getTokens(msg.sender,"Timber",TIMBERTOBUILDGALLEY) );

      //when citizens are introduced to the game,
      //their level of craftsmanship will play a role
      //in the attrubutes, but for now, default
      uint16 strength = 5;
      uint16 speed = 1024;
      uint8 luck = 2;

      Build(msg.sender,strength,speed,luck);
      return _create(msg.sender,strength,speed,luck);
    }
    event Build(address _sender,uint16 strength,uint16 speed,uint8 luck);

    function _create(address _owner,uint16 strength,uint16 speed,uint8 luck) internal returns (uint){
        uint[4] citizenStorage;
        uint[8] tokenStorage;
        Item memory _item = Item({
          strength: strength,
          speed: speed,
          luck: luck,
          birth: uint64(now),
          citizenStorage: citizenStorage,
          tokenStorage: tokenStorage
        });
        uint256 newId = items.push(_item) - 1;
        _transfer(0, _owner, newId);
        return newId;
    }

    function totalSupply() public view returns (uint) {
        return items.length - 1;
    }

    function getToken(uint256 _id) public view returns (address owner,uint16 strength,uint16 speed,uint8 luck,uint64 birth) {
      return (
        tokenIndexToOwner[_id],
        items[_id].strength,
        items[_id].speed,
        items[_id].luck,
        items[_id].birth
        );
    }

    function tokensOfOwner(address _owner) external view returns(uint256[]) {
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
