/*

  run from parent directory:

  mocha tests/account.js

*/
const clevis = require("clevis")
const colors = require('colors')
const chai = require("chai")
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();


//--------------------------------------------------------//

testContractCompile("Catfish")

testContractCompile("Sea")

//--------------------------------------------------------//


function testContractCompile(contract){
  const tab = "\t\t";
  describe('#compile() '+contract.magenta, function() {
    it('should compile '+contract.magenta+' contract to bytecode', async function() {
      this.timeout(10000)
      const result = await clevis("compile",contract)
      assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
      //console.log(result.contracts)
      let count = 0
      for(let c in result.contracts){
        console.log("\t\t"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
        //console.log("result.contracts[c].bytecode:",c,result.contracts)
        if(count++==0){
            assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
        }
      }
    });
  });
}
