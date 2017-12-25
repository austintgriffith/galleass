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

describe('#transfer() ', function() {
  it('should give metamask account some ether', async function() {
    this.timeout(60000)
    await clevis("sendTo","0.1","0","0x34aA3F359A9D614239015126635CE7732c18fDF3")
    await clevis("sendTo","0.1","0","0xB2ac59aE04d0f7310dC3519573BF70387b3b6E3a")
  });
});


//--------------------------------------------------------//
