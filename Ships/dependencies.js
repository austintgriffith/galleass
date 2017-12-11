const fs = require('fs');
module.exports = {
  'CraftableToken.sol': fs.readFileSync('CraftableToken/CraftableToken.sol', 'utf8')
};
