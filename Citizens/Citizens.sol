pragma solidity ^0.4.15;

import 'NFT.sol';
import 'Galleasset.sol';

contract Citizens is Galleasset, NFT {

    string public constant name = "Galleass Citizen";
    string public constant symbol = "G_CITIZEN";

    function Citizens(address _galleass) Galleasset(_galleass) public {
      //0 index should be a blank ship owned by no one
      Citizen memory _citizen = Citizen({
        genes: 0x00000000000000000000000000000000,
        characteristics: 0x00000000000000000000000000000000,
        birth: 0
      });
      citizens.push(_citizen);
    }
    function () public {revert();}

    struct Citizen{
      bytes32 genes;
      bytes32 characteristics;
      uint64 birth;
    }

    Citizen[] private citizens;

    function galleassetTransferFrom(address _from,address _to,uint256 _tokenId) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(_from, _tokenId));
        require(hasPermission(msg.sender,"transferCitizens"));
        _transfer(_from, _to, _tokenId);
    }

    //a citizen is created when food is provided to a village
    function createCitizen(address owner, bytes32 food1, bytes32 food2, bytes32 food3) public isGalleasset("Citizens") returns (uint){
      require(hasPermission(msg.sender,"createCitizens"));

      //eventually you will want to be able to use a standard contract interface
      //instead of just grabbing 3 fillets
      require( getTokens(msg.sender,"Fillet",3) ); // NOT SURE IF THIS SHOULD PULL FROM THE VILLAGE OR THE USER YET
      /*require( getTokens(msg.sender,food1,1) );
      require( getTokens(msg.sender,food2,1) );
      require( getTokens(msg.sender,food3,1) );*/

      //for now there are only fillets, eventually a complex funtion will take in the food and output the characteristics
      bytes32 characteristics = 0x01010101010101010101010101010101;

      //genes will at first be random but then maybe they will be mixed... like you might need
      //to not only have food, but a couple citizens in the village too and you would use
      //their existing genes to mix for the new genes
      bytes32 genes = 0x00000000000000000000000000000000;

      Create(msg.sender,owner,characteristics,genes);
    }
    event Create(address _sender,address _owner, bytes32 _characteristics, bytes32 _genes);


    function _createCitizen(address _owner, bytes32 _genes, bytes32 _characteristics) internal returns (uint){
        Citizen memory _citizen = Citizen({
          genes: _genes,
          characteristics: _characteristics,
          birth: 0
        });
        uint256 newCitizenId = citizens.push(_citizen) - 1;
        _transfer(0, _owner, newCitizenId);
        return newCitizenId;
    }
    //no need for Birth event just look for 0x0 transfers
    //event Birth

    function getCitizen(uint256 _id) public view returns (address,bytes32,bytes32,uint64) {
      return (tokenIndexToOwner[_id],citizens[_id].genes,citizens[_id].characteristics,citizens[_id].birth);
    }

    function getCitizenGenes(uint256 _id) public view returns (uint16 head,uint16 skin,uint16 hair,uint16 eyes,uint16 nose,uint16 mouth,uint16 ears) {
      head = uint16(citizens[_id].characteristics[0]) << 8 | uint16(citizens[_id].genes[1]);
      skin = uint16(citizens[_id].genes[2]) << 8 | uint16(citizens[_id].genes[3]);
      hair = uint16(citizens[_id].genes[4]) << 8 | uint16(citizens[_id].genes[5]);
      eyes = uint16(citizens[_id].genes[6]) << 8 | uint16(citizens[_id].genes[7]);
      nose = uint16(citizens[_id].genes[8]) << 8 | uint16(citizens[_id].genes[9]);
      mouth = uint16(citizens[_id].genes[10]) << 8 | uint16(citizens[_id].genes[11]);
      ears = uint16(citizens[_id].genes[12]) << 8 | uint16(citizens[_id].genes[13]);
      return (head,skin,hair,eyes,nose,mouth,ears);
    }

    function getCitizenCharacteristics(uint256 _id) public view returns (uint16 strength,uint16 stamina,uint16 craftsmanship,uint16 dexterity,uint16 intelligence,uint16 horticulturist,uint16 ambition,uint16 husbandry,uint16 rigorous,uint16 industrious,uint16 cuisinier,uint16 seamanship) {
      strength = uint16(citizens[_id].characteristics[0]) << 8 | uint16(citizens[_id].characteristics[1]);
      stamina = uint16(citizens[_id].characteristics[2]) << 8 | uint16(citizens[_id].characteristics[3]);
      craftsmanship = uint16(citizens[_id].characteristics[4]) << 8 | uint16(citizens[_id].characteristics[5]);
      dexterity = uint16(citizens[_id].characteristics[6]) << 8 | uint16(citizens[_id].characteristics[7]);
      intelligence = uint16(citizens[_id].characteristics[8]) << 8 | uint16(citizens[_id].characteristics[9]);
      horticulturist = uint16(citizens[_id].characteristics[10]) << 8 | uint16(citizens[_id].characteristics[11]);
      ambition = uint16(citizens[_id].characteristics[12]) << 8 | uint16(citizens[_id].characteristics[13]);
      husbandry = uint16(citizens[_id].characteristics[14]) << 8 | uint16(citizens[_id].characteristics[15]);
      rigorous = uint16(citizens[_id].characteristics[16]) << 8 | uint16(citizens[_id].characteristics[17]);
      industrious = uint16(citizens[_id].characteristics[18]) << 8 | uint16(citizens[_id].characteristics[19]);
      cuisinier = uint16(citizens[_id].characteristics[20]) << 8 | uint16(citizens[_id].characteristics[21]);
      seamanship = uint16(citizens[_id].characteristics[22]) << 8 | uint16(citizens[_id].characteristics[23]);
      return (strength,stamina,craftsmanship,dexterity,intelligence,horticulturist,ambition,husbandry,rigorous,industrious,cuisinier,seamanship);
    }

    function totalSupply() public view returns (uint) {
        return citizens.length - 1;
    }

    function citizensOfOwner(address _owner) external view returns(uint256[]) {
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
