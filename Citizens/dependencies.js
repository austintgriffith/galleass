const fs = require('fs');
module.exports = {
  //'CitizensLib.sol': fs.readFileSync('CitizensLib/CitizensLib.sol', 'utf8'),
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8'),
  'NFT.sol': fs.readFileSync('NFT/NFT.sol', 'utf8')
};
