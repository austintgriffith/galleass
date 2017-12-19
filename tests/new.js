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

const fs = require('fs')


//--------------------------------------------------------//

describe('##### COMPILE', function() {
  it('should compile everything', async function() {
    this.timeout(6000000)
    const result = await clevis("test","newcompile")
    assert(result==0,"COMPILE ERRORS")
  });
});

describe('##### DEPLOY', function() {
  it('should deploy everything', async function() {
    this.timeout(6000000)
    const result = await clevis("test","newdeploy")
    assert(result==0,"DEPLOY ERRORS")
  });
});

describe('##### MINT AND TEST TIMBER THEN BUILD SHIPS ', function() {
  it('should stock Sea with fish', async function() {
    this.timeout(6000000)
    const result = await clevis("test","mintTimberBuildShips")
    assert(result==0,"STOCK ERRORS")
  });
});

describe('##### BUY SHIPS AT HARBOR', function() {
  it('should add clouds', async function() {
    this.timeout(6000000)
    const result = await clevis("test","buyShips")
    assert(result==0,"CLOUD ERRORS")
  });
});
