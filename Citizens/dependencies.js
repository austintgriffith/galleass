const fs = require('fs');
module.exports = {
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8'),
  'NFT.sol': fs.readFileSync('NFT/NFT.sol', 'utf8')
};
