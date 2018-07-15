pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Schooner is the main fishing boat in Galleass.

*/

import 'Galleasset.sol';
import 'NFT.sol';

contract Schooner is Galleasset, NFT {

    uint16 public constant TIMBERTOBUILD = 6;


    string public constant name = "Galleass Schooner";
    string public constant symbol = "G_SCHOONER";

    constructor(address _galleass) Galleasset(_galleass) public {
      //0 index should be a blank item owned by no one
      Item memory _item = Item({
        strength: 0,
        speed: 0,
        luck: 0,
        power: 0,
        defense: 0,
        birth: 0
      });
      items.push(_item);
    }
    function () public {revert();}

    struct Item{
      uint16 strength;
      uint16 speed;
      uint8 luck;
      uint16 power;
      uint16 defense;
      uint64 birth;
    }

    Item[] private items;

    function build() public isGalleasset("Schooner") returns (uint){
      require( hasPermission(msg.sender,"buildSchooner") );
      require( getTokens(msg.sender,"Timber",TIMBERTOBUILD) );

      //when citizens are introduced to the game,
      //their level of craftsmanship will play a role
      //in the attrubutes, but for now, default
      uint16 strength = 4;
      uint16 speed = 1536;
      uint8 luck = 1;
      uint16 power = 512;
      uint16 defense = 512;

      Build(msg.sender,strength,speed,luck,power,defense);
      return _create(msg.sender,strength,speed,luck,power,defense);
    }
    event Build(address _sender,uint16 strength,uint16 speed,uint8 luck,uint16 power,uint16 defense);


    function galleassetTransferFrom(address _from,address _to,uint256 _tokenId) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(_from, _tokenId));
        require(hasPermission(msg.sender,"transferSchooner"));
        _transfer(_from, _to, _tokenId);
    }

    function _create(address _owner,uint16 strength,uint16 speed,uint8 luck,uint16 power,uint16 defense) internal returns (uint){
        Item memory _item = Item({
          strength: strength,
          speed: speed,
          luck: luck,
          power: power,
          defense: defense,
          birth: uint64(now)
        });
        uint256 newId = items.push(_item) - 1;
        _transfer(0, _owner, newId);
        return newId;
    }

    function totalSupply() public view returns (uint) {
        return items.length - 1;
    }

    function getToken(uint256 _id) public view returns (address owner,uint16 strength,uint16 speed,uint8 luck,uint16 power,uint16 defense,uint64 birth) {
      return (
        tokenIndexToOwner[_id],
        items[_id].strength,
        items[_id].speed,
        items[_id].luck,
        items[_id].power,
        items[_id].defense,
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
