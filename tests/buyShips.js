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
const Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://:7545"))

//--------------------------------------------------------//
buyShip(2,"0.001",0)
buyShip(2,"0.001",0)
//--------------------------------------------------------//

function buyShip(accountindex,ether,model){
  const tab = "\t\t";
  describe('#buyShip()', function() {
    it('should buy ship from the Harbor', async function() {
      this.timeout(60000)
      const accounts = await clevis("accounts")
      const wei = await clevis("wei",ether,"ether")
      const result = await clevis("contract","buyShip","Harbor",accountindex,wei,model)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      const ships = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
      console.log(tab,"Ships belonging to "+accounts[accountindex].blue+":",ships)
    });
  });
}
