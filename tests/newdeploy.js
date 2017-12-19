/*

  run from parent directory:

  mocha tests/account.js

*/
const clevis = require("clevis")
const colors = require('colors')
const chai = require("chai")
const fs = require("fs")
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();
const tab = "\t\t";


function localContractAddress(contract){
  return fs.readFileSync(contract+"/"+contract+".address").toString().trim()
}

const Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://:7545"))


//--------------------------------------------------------//

testContractDeploy("Galleass",0)

testContractDeploy("Ships",0)
setContract("Ships",0)

testContractDeploy("Harbor",0)
setContract("Harbor",0)
setPermission("Harbor",0,"buildShip","true")

testContractDeploy("Timber",0)
setContract("Timber",0)




//--------------------------------------------------------//


function testContractDeploy(contract,accountindex){
  const tab = "\t\t";
  describe('#deploy() '+contract.magenta, function() {
    it('should deploy '+contract.magenta+' as account '+accountindex, async function() {
      this.timeout(60000)
      const result = await clevis("deploy",contract,accountindex)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      console.log(tab+"Address: "+result.contractAddress.blue)
      assert(result.contractAddress)
    });
  });
}

function setContract(contract,accountindex){
  const tab = "\t\t";
  describe('#setContract() '+contract.magenta, function() {
    it('should setContract with main contract', async function() {
      this.timeout(60000)
      let contractAddress = localContractAddress(contract)
      const setResult = await clevis("contract","setContract","Galleass",accountindex,web3.utils.fromAscii(contract),contractAddress)
      console.log(tab,setResult.transactionHash.gray,(""+setResult.gasUsed).yellow)
      const getResult = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(contract))
      assert(getResult==contractAddress,"Contract Address did not set correctly")
      //finally, make sure the contract links back to the correct main galleass address
      const galleass = await clevis("contract","galleass",contract)
      assert(galleass==localContractAddress("Galleass"),"Galleass main address is wrong or contract isn't Galleasset")
    });
  });
}

function setPermission(contract,accountindex,permission,value){
  const tab = "\t\t";
  describe('#setPermission() '+contract.magenta, function() {
    it('should setPermission with main contract', async function() {
      this.timeout(60000)
      let contractAddress = localContractAddress(contract)
      const setResult = await clevis("contract","setPermission","Galleass",accountindex,contractAddress,web3.utils.fromAscii(permission),value)
      console.log(tab+contract+" permission ("+permission.magenta+"): "+value)
      const getResult = await clevis("contract","hasPermission","Galleass",contractAddress,web3.utils.fromAscii(permission))
      assert(""+getResult===value,"Contract Permission did not set correctly")
    });
  });
}
