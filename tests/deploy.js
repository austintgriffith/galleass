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

//--------------------------------------------------------//

testContractDeploy("Catfish",0)

testContractDeploy("Sea",0)

allowSpecies("Catfish",0)



//--------------------------------------------------------//

function allowSpecies(contract,accountindex){
  describe('#allowSpecies() '+contract.magenta, function() {
    it('should allow species '+contract.magenta, async function() {
      this.timeout(60000)
      let contractAddress = fs.readFileSync(""+contract+"/"+contract+".address").toString().trim();
      const result = await clevis("contract","allowSpecies","Sea",accountindex,contractAddress)
      console.log(tab,result.transactionHash.gray,contractAddress.blue,(""+result.gasUsed).yellow)
      assert(result.transactionHash,"No transaction hash!?")
    });
  });
}

function testContractDeploy(contract,accountindex){
  const tab = "\t\t";
  describe('#deploy() '+contract.magenta, function() {
    it('should deploy '+contract.magenta+' as account '+accountindex, async function() {
      this.timeout(60000)
      const result = await clevis("deploy",contract,accountindex)
      console.log(tab+"Address: "+result.contractAddress.blue)
      assert(result.contractAddress)
    });
  });
}
