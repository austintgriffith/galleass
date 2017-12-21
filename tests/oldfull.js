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

describe('##### COMPILE', function() {
  it('should compile everything', async function() {
    this.timeout(6000000)
    const result = await clevis("test","compile")
    assert(result==0,"COMPILE ERRORS")
  });
});

describe('##### DEPLOY', function() {
  it('should deploy everything', async function() {
    this.timeout(6000000)
    const result = await clevis("test","deploy")
    assert(result==0,"DEPLOY ERRORS")
  });
});

describe('##### STOCK', function() {
  it('should stock Sea with fish', async function() {
    this.timeout(6000000)
    const result = await clevis("test","stock")
    assert(result==0,"STOCK ERRORS")
  });
});

describe('##### CLOUDS', function() {
  it('should add clouds', async function() {
    this.timeout(6000000)
    const result = await clevis("test","clouds")
    assert(result==0,"CLOUD ERRORS")
  });
});

describe('##### PUBLISH', function() {
  it('should publish address and abi to app', async function() {
    this.timeout(6000000)
    const result = await clevis("test","publish")
    assert(result==0,"PUBLISH ERRORS")
  });
});


describe('##### METAMASK', function() {
  it('should get funds to metamask', async function() {
    this.timeout(6000000)
    const result = await clevis("test","metamask")
    assert(result==0,"METAMASK ERRORS")
  });
});


//--------------------------------------------------------//
