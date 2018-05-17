const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'zeppelin-solidity/contracts/ownership/HasNoEther.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/HasNoEther.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/MintableToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/MintableToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/StandardToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/StandardToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/BasicToken.sol': fs.readFileSync('zeppelin-solidity/contracts/token/BasicToken.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20.sol', 'utf8'),
  'zeppelin-solidity/contracts/token/ERC20Basic.sol': fs.readFileSync('zeppelin-solidity/contracts/token/ERC20Basic.sol', 'utf8'),
  'zeppelin-solidity/contracts/math/SafeMath.sol': fs.readFileSync('zeppelin-solidity/contracts/math/SafeMath.sol', 'utf8'),
  'ERC677Token.sol': fs.readFileSync('ERC677Token/ERC677Token.sol', 'utf8'),
  'Galleasset.sol': fs.readFileSync('Galleasset/Galleasset.sol', 'utf8')
};
