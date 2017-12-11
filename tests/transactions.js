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


//--------------------------------------------------------//

for(let c=0;c<10;c++){
  tx()
}



//--------------------------------------------------------//

function tx(){
  const tab = "\t\t";
  describe('#transaction() ', function() {
    it('should add a new block to the chain', async function() {
      this.timeout(60000)
      let result = await clevis("send","0.1","1","2")
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
    });
  });
}
