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
      let address = fs.readFileSync("Galleass/Galleass.address").toString().trim()
      console.log(tab,"ADDRESS:",address.blue)
      assert(address,"No Address!?")
      fs.writeFileSync("app/src/Address.js","module.exports = \""+address+"\"");
      loadAbi("Galleass")
      loadAbi("Sea")
      loadAbi("Harbor")
    });
  });
}

function loadAbi(contract){
  let abi = fs.readFileSync(contract+"/"+contract+".abi").toString().trim()
  //console.log(contract+" ABI:",abi.gray)
  fs.writeFileSync("app/src/"+contract+".abi.js","module.exports = "+abi);
}
