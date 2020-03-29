const fs = require('fs');
module.exports = {
  'openzeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('openzeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8'),
  'NFT.sol': fs.readFileSync('NFT/NFT.sol', 'utf8')
};
