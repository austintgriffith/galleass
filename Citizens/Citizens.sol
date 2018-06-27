pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Citizen represents workers in Galleass
  They have genetics and characteristics and extend the ERC721 token standard

*/

import 'Galleasset.sol';
import 'NFT.sol';

contract Citizens is Galleasset, NFT {

    string public constant name = "Galleass Citizen";
    string public constant symbol = "G_CITIZEN";

    constructor(address _galleass) Galleasset(_galleass) public {
      //0 index should be a blank ship owned by no one
      Citizen memory _citizen = Citizen({
        status: 0,
        data: 0,
        x: 0,
        y: 0,
        tile: 0,
        genes: 0x0000000000000000000000000000000000000000000000000000000000000000,
        characteristics: 0x0000000000000000000000000000000000000000000000000000000000000000,
        birth: 0
      });
      citizens.push(_citizen);
    }
    function () public {revert();}

    struct Citizen{
      uint8 status;
      uint data;
      uint16 x;
      uint16 y;
      uint8 tile;
      bytes32 genes;
      bytes32 characteristics;
      uint64 birth;
    }

    Citizen[] private citizens;

    //any Galleass contract that has transferCitizens can just move citizens from one owner to another
    // this should probably only be given to the CitizensLib...
    function galleassetTransferFrom(address _from,address _to,uint256 _tokenId) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(_from, _tokenId));
        require(hasPermission(msg.sender,"transferCitizens"));
        _transfer(_from, _to, _tokenId);
    }

    //-------------- CitizenLib Access Functions -----------------------------------------------------//
    /*
      Citizen Lib needs full access to the storage of Citizens so we can keep the Citizen contract
      storage intact but still upgrade the funtionality in the CitizenLib contract
     */
    function createCitizen(address _owner,uint8 _status,uint _data,uint16 _x,uint16 _y, uint8 _tile, bytes32 _genes, bytes32 _characteristics) public isGalleasset("Citizens") returns (uint){
      require(msg.sender == getContract("CitizensLib"));
      _createCitizen(_owner,_status,_data,_x,_y,_tile,_genes,_characteristics);
    }

    function setStatus(uint _id,uint8 _status) public isGalleasset("Citizens") returns (bool){
      require(msg.sender == getContract("CitizensLib"));
      Citizen c = citizens[_id];
      c.status = _status;
      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }

    function setTile(uint _id,uint8 _tile) public isGalleasset("Citizens") returns (bool){
      require(msg.sender == getContract("CitizensLib"));
      Citizen c = citizens[_id];
      c.tile = _tile;
      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }

    function setData(uint _id,uint _data) public isGalleasset("Citizens") returns (bool){
      require(msg.sender == getContract("CitizensLib"));
      Citizen c = citizens[_id];
      c.data = _data;
      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }
    //------------------------------------------------------------------------------------------------//

    function _createCitizen(address _owner,uint8 _status,uint _data,uint16 _x,uint16 _y, uint8 _tile, bytes32 _genes, bytes32 _characteristics) internal returns (uint){
        Citizen memory _citizen = Citizen({
          status: _status,
          data: _data,
          x:_x,
          y:_y,
          tile:_tile,
          genes: _genes,
          characteristics: _characteristics,
          birth: uint64(block.number)
        });
        uint256 newCitizenId = citizens.push(_citizen) - 1;
        _transfer(0, _owner, newCitizenId);
        emit CitizenUpdate(newCitizenId,_citizen.x,_citizen.y,_citizen.tile,_owner,_citizen.status,_citizen.data,_citizen.genes,_citizen.characteristics);
        return newCitizenId;
    }
    event CitizenUpdate(uint indexed id,uint16 indexed x, uint16 indexed y,uint8 tile,address owner,uint8 status,uint data,bytes32 genes,bytes32 characteristics);

    function totalSupply() public view returns (uint) {
        return citizens.length - 1;
    }

    function getToken(uint256 _id) public view returns (address owner,uint8 status,uint data,uint16 x,uint16 y,uint8 tile, bytes32 genes,bytes32 characteristics,uint64 birth) {
      Citizen c = citizens[_id];
      return (tokenIndexToOwner[_id],c.status,c.data,c.x,c.y,c.tile,c.genes,c.characteristics,c.birth);
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
