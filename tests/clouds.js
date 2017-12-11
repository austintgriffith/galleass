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

cloud(0,1,200)
cloud(0,2,120)
cloud(0,3,20)
cloud(0,4,90)
cloud(0,5,230)
cloud(0,6,150)
cloud(0,7,60)


//--------------------------------------------------------//

//  function addCloud(uint16 _location,uint8 _speed,uint8 _image,bool _orientation) onlyOwner public returns (bool) {
function cloud(accountIndex,image,speed){
  const tab = "\t\t";
  describe('#cloud() ', function() {
    it('should add cloud', async function() {
      this.timeout(60000)
      let width = await clevis("contract","width","Sea")
      let location = rand(0,width);
      let result = await clevis("contract","addCloud","Sea",accountIndex,location,speed,image)
      console.log(tab,(""+location).white,(""+speed).gray,result.transactionHash.gray,(""+result.gasUsed).yellow)
    });
  });
}



function rand(min, max) {
  return Math.floor( Math.random() * (max - min) + min );
}
