pragma solidity ^0.4.15;

contract CraftableToken {

  function CraftableToken() public { }

  struct ExternalCraftableToken{
    address contractAddress;
    uint256 tokenId;
  }
  mapping (uint256 => ExternalCraftableToken[]) public ingredients;

  function addIngredient(uint256 _parentTokenId, address _contractAddress, uint256 _tokenId) external {
      require(_owns(msg.sender, _parentTokenId));
      CraftableToken craftableTokenContract = CraftableToken(_contractAddress);
      require(craftableTokenContract.getIngredient(_parentTokenId,_tokenId));
      //
      //require(craftableTokenContract.ownerOf(msg.sender, _parentTokenId));
      //require(_craftableTokenContractAddress._raw(_tokenId));
      //_transfer(msg.sender, _to, _tokenId);
  }

  //called from parent craftable token to add ingredient to parent
  function getIngredient(uint256 _parentTokenId,uint256 _tokenId) public returns (bool) {
    require(isRaw(_tokenId));

  }

  //links child token to a parent token
  // the parent token is crafted using child tokens
  mapping (uint256 => ExternalCraftableToken) public tokenIndexToCrafted;

  //only raw tokens can be transferred or used to craft
  // once they are part of a parent token they can no
  // longer be used until the parent is disassembled
  function isRaw(uint256 _tokenId) public view returns (bool) {
      return (
        tokenIndexToCrafted[_tokenId].contractAddress == address(0) &&
        tokenIndexToCrafted[_tokenId].tokenId == 0
      );
  }


  mapping (uint256 => address) public tokenIndexToOwner;
  mapping (address => uint256) ownershipTokenCount;
  mapping (uint256 => address) public tokenIndexToApproved;


  function transfer(address _to,uint256 _tokenId) external {
      require(_to != address(0));
      require(_to != address(this));
      require(_owns(msg.sender, _tokenId));
      require(isRaw(_tokenId));
      _transfer(msg.sender, _to, _tokenId);
  }
  function _transfer(address _from, address _to, uint256 _tokenId) internal {
      ownershipTokenCount[_to]++;
      tokenIndexToOwner[_tokenId] = _to;
      if (_from != address(0)) {
          ownershipTokenCount[_from]--;
          delete tokenIndexToApproved[_tokenId];
      }
      Transfer(_from, _to, _tokenId);
  }
  event Transfer(address from, address to, uint256 tokenId);

  function transferFrom(address _from,address _to,uint256 _tokenId) external {
      require(_to != address(0));
      require(_to != address(this));
      require(_approvedFor(msg.sender, _tokenId));
      require(_owns(_from, _tokenId));
      require(isRaw(_tokenId));
      _transfer(_from, _to, _tokenId);
  }

  function approve(address _to,uint256 _tokenId) external {
      require(_owns(msg.sender, _tokenId));
      require(isRaw(_tokenId));
      _approve(_tokenId, _to);
      Approval(msg.sender, _to, _tokenId);
  }
  event Approval(address owner, address approved, uint256 tokenId);

  function _approve(uint256 _tokenId, address _approved) internal {
      tokenIndexToApproved[_tokenId] = _approved;
  }

  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return tokenIndexToOwner[_tokenId] == _claimant;
  }

  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return tokenIndexToApproved[_tokenId] == _claimant;
  }

  function balanceOf(address _owner) public view returns (uint256 count) {
      return ownershipTokenCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address owner) {
      owner = tokenIndexToOwner[_tokenId];
      require(owner != address(0));
  }

}
