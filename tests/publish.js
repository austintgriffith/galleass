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

publish()

//--------------------------------------------------------//

function publish(){
  describe('#publish() ', function() {
    it('should inject contract address and abi into web app', async function() {
      this.timeout(60000)
      const fs = require("fs")
      let address = fs.readFileSync("Sea/Sea.address").toString().trim()
      console.log("ADDRESS:",address.blue)
      let abi = fs.readFileSync("Sea/Sea.abi").toString().trim()
      console.log("ABI:",abi.gray)

      assert(address&&abi,"No Address or ABI!?")

      fs.writeFileSync("app/src/Address.js","module.exports = \""+address+"\"");
      fs.writeFileSync("app/src/Abi.js","module.exports = "+abi);
    });
  });
}
