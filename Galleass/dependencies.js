const fs = require('fs');
module.exports = {
  'openzeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('openzeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'Predecessor.sol': fs.readFileSync('Predecessor/Predecessor.sol', 'utf8'),
  'Staged.sol': fs.readFileSync('Staged/Staged.sol', 'utf8')
}
