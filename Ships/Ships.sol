pragma solidity ^0.4.15;

import 'NFT.sol';
import 'Galleasset.sol';

contract Ships is Galleasset, NFT {

    string public constant name = "Galleass Ship";
    string public constant symbol = "G_SHIP";

    function Ships(address _galleass) Galleasset(_galleass) public {
      //0 index should be a blank ship owned by no one
      Ship memory _ship = Ship({
        model: Model(0),
        birth: 0
      });
      ships.push(_ship);
    }

    enum Model{
      FISHING
    }

    struct Ship{
      Model model;
      uint64 birth;
    }

    Ship[] private ships;

    function buildShip(Model model) public returns (uint){
      if(model==Model.FISHING){
        require( getTokens(msg.sender,"Timber",2) );
        require( hasPermission(msg.sender,"buildShip") );
        return _createShip(msg.sender, model);
      }
      revert();
    }
    function buildShips(Model model,uint amount) public returns (uint){
      uint result;
      while((amount--)>0){
        result=buildShip(model);
      }
      return result;
    }

    function _createShip(address _owner, Model model) internal returns (uint){
        Ship memory _ship = Ship({
          model: model,
          birth: uint64(now)
        });
        uint256 newShipId = ships.push(_ship) - 1;
        //require(newShipId == uint256(uint32(newShipId)));//this is from the CK stuff
        //Birth(_owner,newShipId);
        _transfer(0, _owner, newShipId);
        return newShipId;
    }
    //no need for Birth even just look for 0x0 transfers
    //event Birth(address owner, uint256 shipId);

    function getShip(uint256 _id) public view returns (address,Model,uint64) {
      return (tokenIndexToOwner[_id],ships[_id].model,ships[_id].birth);
    }
    function getShipModel(uint256 _id) public view returns (Model) {
      return (ships[_id].model);
    }

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
