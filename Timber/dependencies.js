const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20/MintableToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20/StandardToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20/BasicToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20/BasicToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20/ERC20.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20/ERC20.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol', 'utf8'),
  'zeppelin-solidity/contracts/math/SafeMath.sol': fs.readFileSync('zeppelin-solidity/contracts/math/SafeMath.sol', 'utf8'),
  'ERC677Token.sol': fs.readFileSync('ERC677Token/ERC677Token.sol', 'utf8'),
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8')
};
