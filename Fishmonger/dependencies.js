const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'DataParser.sol': fs.readFileSync('DataParser/DataParser.sol', 'utf8'),
  'StandardTile.sol': fs.readFileSync('StandardTile/StandardTile.sol', 'utf8'),
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8')
};
