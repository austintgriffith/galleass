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

stock("Catfish",0,10)

//--------------------------------------------------------//


function stock(species,accountindex,amount){
  const tab = "\t\t";
  describe('#stock() '+species.magenta, function() {
    it('should stock '+amount+' '+species.magenta+' as account '+accountindex, async function() {
      this.timeout(60000)
      let seaAddress = fs.readFileSync("Sea/Sea.address").toString().trim();
      let speciesAddress = fs.readFileSync(species+"/"+species+".address").toString().trim();
      await clevis("contract","approve",species,accountindex,seaAddress,amount)
      const result = await clevis("contract","stock","Sea",accountindex,speciesAddress,amount)
      console.log(tab,result.transactionHash.gray,speciesAddress.blue,(""+result.gasUsed).yellow)
      assert(result.transactionHash,"No transaction hash!?")
    });
  });
}
