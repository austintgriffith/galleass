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
const Web3 = require('web3')

//--------------------------------------------------------//

const ACCOUNT = 4
let TARGET_LOCATION;
let TARGET_FISH;
let BAIT;
embark()
findFish()
setSailTowardFish()
transactionsUntilAtFish()
dropAnchor()
castLine()
reelIn()

//--------------------------------------------------------//

function reelIn(){
  const tab = "\t\t";
  describe('#reelIn() ', function() {
    it('should reelIn '+TARGET_FISH, async function() {
      this.timeout(60000)
      //run one transaction to make sure it's the next block
      let result = await clevis("send","0.1","1","2")
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)

      console.log(tab,"Reeling in fish: ",TARGET_FISH.magenta)
      result = await clevis("contract","reelIn","Sea",ACCOUNT,TARGET_FISH,BAIT)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
    })
  })
}


function castLine(){
  const tab = "\t\t";
  describe('#castLine() ', function() {
    it('should castLine with random bait', async function() {
      this.timeout(60000)
      let web3 = new Web3()
      BAIT = web3.utils.sha3(Math.random()+Date.now()+"LIVEBAIT!");
      console.log(tab,"Using Bait:",BAIT.blue)
      let baitHash = web3.utils.sha3(BAIT);
      console.log(tab,"Bait hash:",baitHash.magenta)
      let result = await clevis("contract","castLine","Sea",ACCOUNT,baitHash)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
    })
  })
}


function dropAnchor(){
  const tab = "\t\t";
  describe('#dropAnchor() ', function() {
    it('should dropAnchor', async function() {
      this.timeout(60000)
      let result = await clevis("contract","dropAnchor","Sea",ACCOUNT)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
    })
  })
}

function transactionsUntilAtFish(){
  const tab = "\t\t";
  describe('#transactionsUntilAtFish() ', function() {
    it('should add a new block to the chain', async function() {
      this.timeout(60000)

      let accounts = await clevis("accounts")
      let myAddress = accounts[ACCOUNT];
      //console.log("My address:",myAddress)
      let myShip = await clevis("contract","getShip","Sea",myAddress);
      //console.log(myShip)
      console.log("\t\t Heading "+myShip.direction+" because ("+myAddress+") is at "+myShip.location+" and I need to get to "+TARGET_LOCATION)

      if(!myShip.direction){
        while( myShip.location > TARGET_LOCATION){
          let result = await clevis("send","0.1","1","2")
          console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
          myShip = await clevis("contract","getShip","Sea",myAddress);
        }
      }else{
        while( myShip.location < TARGET_LOCATION){
          let result = await clevis("send","0.1","1","2")
          console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
          myShip = await clevis("contract","getShip","Sea",myAddress);
        }
      }
    });
  });
}



function setSailTowardFish(){
  describe('#setSailTowardFish() ', function() {
    it('should setSailTowardFish', async function() {
      this.timeout(60000)
      assert(TARGET_LOCATION>0,"We need to findFish before this function runs")

      let accounts = await clevis("accounts")
      let myAddress = accounts[ACCOUNT];
      let myShip = await clevis("contract","getShip","Sea",myAddress);

      let direction = myShip.location < TARGET_LOCATION

      console.log("\t\t Heading "+direction+" because I'm at "+myShip.location+" and I need to get to "+TARGET_LOCATION)

      let result = await clevis("contract","setSail","Sea",ACCOUNT,""+direction)
      //console.log(result)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      assert(result.transactionHash,"No transaction hash!?")

    });
  });
}


function findFish(){
  describe('#findFish() ', function() {
    it('should find a fish', async function() {
      this.timeout(60000)

      let accounts = await clevis("accounts")
      let myAddress = accounts[ACCOUNT];
      let myShip = await clevis("contract","getShip","Sea",myAddress);

      console.log("\t\tFinding a fish for "+myAddress.magenta+" @ "+myShip.location+"...");

      let result = await clevis("contract","eventFish","Sea")
      let fish = [];
      for(let f in result){
        let id = result[f].returnValues.id;
        let timestamp = result[f].returnValues.timestamp;
        let species = result[f].returnValues.species;
        if( !fish[id] || fish[id].timestamp < timestamp){
          fish[id] = {timestamp:timestamp,species:species}
        }
      }

      let bestFish = false
      let bestDistance = 9999999

      for(let id in fish){
        let species = fish[id].species;
        if("0x0000000000000000000000000000000000000000"!=species){
          let location = await clevis("contract","fishLocation","Sea",id);
          console.log(id.white,species.gray,location)
          let thisDistance = Math.abs( myShip.location - location[0])
          if( thisDistance < bestDistance){
            bestDistance=thisDistance
            bestFish=id
          }
        }
      }

      let location = await clevis("contract","fishLocation","Sea",bestFish)

      TARGET_LOCATION = location[0];
      TARGET_FISH = bestFish
      console.log("Best fish is "+bestFish.magenta+" at a distance ("+(""+bestDistance).green+") @ ",TARGET_LOCATION)
      assert(TARGET_LOCATION>0,"No Target Location found!?!")
    });
  });
}

function embark(){
  describe('#embark() ', function() {
    it('should embark', async function() {
      this.timeout(60000)

      let accounts = await clevis("accounts")
      let myAddress = accounts[ACCOUNT];
      //check for existing account
      let existingShip = await clevis("contract","getShip","Sea",myAddress)
      if(existingShip.floating){
        console.log("\t\t","Warning, ship is already floating...".yellow)
      }else{
        let result = await clevis("contract","embark","Sea",ACCOUNT)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")
      }

    });
  });
}
