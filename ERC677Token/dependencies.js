const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/token/StandardToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/StandardToken.sol', 'utf8')
};
