
const clevis = require("clevis")
const colors = require('colors')
const chai = require("chai")
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();
describe('#compile() Village', function() {
  it('should compile Village contract to bytecode', async function() {
    this.timeout(90000)
    let contract = "Village"
    const result = await clevis("compile",contract)
    console.log(result)
    assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
    let count = 0
    for(let c in result.contracts){
      console.log("		"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
      if(count++==0){
          assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
      }
    }
  });
});

  