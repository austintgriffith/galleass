pragma solidity ^0.4.15;

//https://github.com/ethereum/EIPs/issues/721
// thanks to Dieter Shirley && http://axiomzen.co

contract NFT {

  function NFT() public { }

  mapping (uint256 => address) public tokenIndexToOwner;
  mapping (address => uint256) ownershipTokenCount;
  mapping (uint256 => address) public tokenIndexToApproved;

  function transfer(address _to,uint256 _tokenId) external {
      require(_to != address(0));
      require(_to != address(this));
      require(_owns(msg.sender, _tokenId));
      _transfer(msg.sender, _to, _tokenId);
  }
  function _transfer(address _from, address _to, uint256 _tokenId) internal {
      ownershipTokenCount[_to]++;
      tokenIndexToOwner[_tokenId] = _to;
      if (_from != address(0)) {
          ownershipTokenCount[_from]--;
          delete tokenIndexToApproved[_tokenId];
      }
      emit NFTTransfer(_from, _to, _tokenId);
  }
  //
  //for some reason transactions never return a receipt if this is "Transfer" even though there is no conflict with the name
  // I have no effing clue what I'm doing wrong but I had to rename this to "NFTTransfer" and it works now :(
  //
  event NFTTransfer(address from, address to, uint256 tokenId);

  function transferFrom(address _from,address _to,uint256 _tokenId) external {
      require(_to != address(0));
      require(_to != address(this));
      require(_approvedFor(msg.sender, _tokenId));
      require(_owns(_from, _tokenId));
      _transfer(_from, _to, _tokenId);
  }

  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return tokenIndexToOwner[_tokenId] == _claimant;
  }
  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return tokenIndexToApproved[_tokenId] == _claimant;
  }
  function _approve(uint256 _tokenId, address _approved) internal {
      tokenIndexToApproved[_tokenId] = _approved;
  }

  function approve(address _to,uint256 _tokenId) external {
      require(_owns(msg.sender, _tokenId));
      _approve(_tokenId, _to);
      emit NFTApproval(msg.sender, _to, _tokenId);
  }
  //
  // see NFTTransfer for explanation on weird function name here
  //
  event NFTApproval(address owner, address approved, uint256 tokenId);

  function balanceOf(address _owner) public view returns (uint256 count) {
      return ownershipTokenCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address owner) {
      owner = tokenIndexToOwner[_tokenId];
      require(owner != address(0));
  }

  function allowance(address _claimant, uint256 _tokenId) public view returns (bool) {
      return _approvedFor(_claimant,_tokenId);
  }
}
