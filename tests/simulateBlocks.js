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

simulateBlocks()



//--------------------------------------------------------//

function simulateBlocks(){
  const tab = "\t\t";
  describe('#simulateBlocks() ', function() {
    it('should simulateBlocks', async function() {

      this.timeout(60000000)
      while(true){
        let accounts = await clevis("accounts")
         accounts = await clevis("accounts")
         accounts = await clevis("accounts")
         accounts = await clevis("accounts")
        let result = await clevis("send","0.1","1","2")
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      }

    });
  });
}
