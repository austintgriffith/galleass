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

    /* function runTest() public returns (bool) {
      uint count = CitizensLib(getContract("CitizensLib")).addPlease();
      emit RunTest(count);
      //addr.delegatecall(bytes4(keccak256("addPlease()")));
      return true;
    }
    event RunTest(uint count); */

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

    function galleassetTransferFrom(address _from,address _to,uint256 _tokenId) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(_from, _tokenId));
        require(hasPermission(msg.sender,"transferCitizens"));
        _transfer(_from, _to, _tokenId);
    }

    //citizens should be bought and sold for ether
    function setPrice(uint _id,uint _price) public isGalleasset("Citizens") returns (bool){
      //you must own the citizen to set its sale price
      require(tokenIndexToOwner[_id]==msg.sender);
      //create object for smaller local stack
      Citizen c = citizens[_id];
      //the citizen must be idle to go on sale
      require(c.status==1||c.status==2);
      if(_price==0){
        //setting the price to 0 means not for sale any more
        c.status = 1;
      }else{
        //set status to 2 (for sale)
        c.status = 2;
      }
      c.data = _price;
      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }

    function moveCitizen(uint _id,uint8 _tile) public isGalleasset("Citizens") returns (bool) {
      //you must own the citizen to move them
      require(tokenIndexToOwner[_id]==msg.sender);
      //create object for smaller local stack
      Citizen c = citizens[_id];
      //the citizen must be idle to move
      require(c.status==1);
      //you must own all the land between the current location and the destination
      //(bascially they will walk at the speed of light at first, but eventually
      // there should probably be some sort of transportation per island and it
      // takes a varying amount of time to move from tile to tile)
      Land landContract = Land(getContract("Land"));
      //first let's just make sure they own the dest and build the other stuff in
      //maybe it's fine for them to move anywhere on local islands at first idk
      //destination can't be water
      require(landContract.tileTypeAt(c.x,c.y,_tile)>0);
      //must own destination
      require(landContract.ownerAt(c.x,c.y,_tile)==msg.sender);
      //you can't already be at the destination
      require(c.tile!=_tile);

      c.tile=_tile;

      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }

    //a citizen is created when food is provided to a village
    function createCitizen(address owner, bytes32 food1, bytes32 food2, bytes32 food3, uint16 _x, uint16 _y, uint8 _tile) public isGalleasset("Citizens") returns (uint){
      require(hasPermission(msg.sender,"createCitizens"));

      //eventually you will want to be able to use a standard contract interface
      //instead of just grabbing 3 fillets

      /*
      i went back and forth for a while trying to decide if you send the fillet to the village
      then, this contract pulls from there. It's really cool to see the village contract "inventory"
      BUT, if there is a contract for every village then it would need to be deployed as a new one is built
      this deployment would have to come from the builder and you would have to trust it...
      ...maybe that is okay? Maybe the bytecode could be compared or something...
      ..I think I've decided against that, I think it makes more sense to have one contract for all of the villages.
      */
      require( getGalleassTokens(owner,"Fillet",3) );
      /*require( getTokens(msg.sender,food1,1) );
      require( getTokens(msg.sender,food2,1) );
      require( getTokens(msg.sender,food3,1) );*/

      //for now there are only fillets, eventually a complex funtion will take in the food and output the characteristics
      bytes32 characteristics = 0x0005000500000000000000000000000000000000000000000000000000000000;

      //genes will at first be random but then maybe they will be mixed... like you might need
      //to not only have food, but a couple citizens in the village too and you would use
      //their existing genes to mix for the new genes
      bytes32 genes = keccak256(citizens.length,block.blockhash(block.number-1));

      _createCitizen(owner,1,0,_x,_y,_tile,genes,characteristics);
    }

    function setStatus(uint _id,uint8 _status) public isGalleasset("Citizens") returns (bool){
      require(hasPermission(msg.sender,"useCitizens"));
      Citizen c = citizens[_id];
      c.status = _status;
      emit CitizenUpdate(_id,c.x,c.y,c.tile,tokenIndexToOwner[_id],c.status,c.data,c.genes,c.characteristics);
      return true;
    }

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

    //no need for Birth event just look for 0x0 transfers
    //event Birth

    function getCitizenStatus(uint256 _id) public view returns (uint8 status,uint16 x, uint16 y, uint8 tile,uint data) {
      return (citizens[_id].status,citizens[_id].x,citizens[_id].y,citizens[_id].tile,citizens[_id].data);
    }

    function getCitizenGenes(uint256 _id) public view returns (uint16 head,uint16 hair,uint16 eyes,uint16 nose,uint16 mouth) {
      head = uint16(citizens[_id].genes[0]) << 8 | uint16(citizens[_id].genes[1]);
      hair = uint16(citizens[_id].genes[2]) << 8 | uint16(citizens[_id].genes[3]);
      eyes = uint16(citizens[_id].genes[4]) << 8 | uint16(citizens[_id].genes[5]);
      nose = uint16(citizens[_id].genes[6]) << 8 | uint16(citizens[_id].genes[7]);
      mouth = uint16(citizens[_id].genes[8]) << 8 | uint16(citizens[_id].genes[9]);
      return (head,hair,eyes,nose,mouth);
    }

    function getCitizenBaseCharacteristics(uint256 _id) public view returns (uint16 strength,uint16 stamina,uint16 dexterity,uint16 intelligence,uint16 ambition,uint16 rigorous,uint16 industrious) {
      strength = uint16(citizens[_id].characteristics[0]) << 8 | uint16(citizens[_id].characteristics[1]);
      stamina = uint16(citizens[_id].characteristics[2]) << 8 | uint16(citizens[_id].characteristics[3]);
      dexterity = uint16(citizens[_id].characteristics[4]) << 8 | uint16(citizens[_id].characteristics[5]);
      intelligence = uint16(citizens[_id].characteristics[6]) << 8 | uint16(citizens[_id].characteristics[7]);
      ambition = uint16(citizens[_id].characteristics[8]) << 8 | uint16(citizens[_id].characteristics[9]);
      rigorous = uint16(citizens[_id].characteristics[10]) << 8 | uint16(citizens[_id].characteristics[11]);
      industrious = uint16(citizens[_id].characteristics[12]) << 8 | uint16(citizens[_id].characteristics[13]);
      return (strength, stamina, dexterity, intelligence, ambition, rigorous, industrious);
    }
    function getCitizenSkillCharacteristics(uint256 _id) public view returns (uint16 husbandry,uint16 cuisinier,uint16 seamanship,uint16 horticulturist,uint16 craftsmanship) {
      husbandry = uint16(citizens[_id].characteristics[16]) << 8 | uint16(citizens[_id].characteristics[17]);
      cuisinier = uint16(citizens[_id].characteristics[18]) << 8 | uint16(citizens[_id].characteristics[19]);
      seamanship = uint16(citizens[_id].characteristics[20]) << 8 | uint16(citizens[_id].characteristics[21]);
      horticulturist = uint16(citizens[_id].characteristics[22]) << 8 | uint16(citizens[_id].characteristics[23]);
      craftsmanship = uint16(citizens[_id].characteristics[24]) << 8 | uint16(citizens[_id].characteristics[25]);
      return (husbandry, cuisinier, seamanship, horticulturist, craftsmanship);
    }

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


contract CitizensLib{
  function addPlease() public returns (uint) { }
}

contract Land {
  mapping (uint16 => mapping (uint16 => uint16[18])) public tileTypeAt;
  mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
  mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
  mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;
  //function getTile(uint16 _x,uint16 _y,uint8 _index) public constant returns (uint16 _tile,address _contract,address _owner,uint256 _price) { }
}
