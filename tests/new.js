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

testContractCompile("Galleass")
testContractDeploy("Galleass",0)

testContractCompile("Ships")
testContractDeploy("Ships",0)
setContract("Ships",0)

testContractCompile("Harbor")
testContractDeploy("Harbor",0)
setContract("Harbor",0)
setPermission("Harbor",0,"buildShip","true")

testContractCompile("Timber")
testContractDeploy("Timber",0)
setContract("Timber",0)

testMint("Timber",0,1,10)

// //make sure you can't build ships directly
// approveContract("Timber",1,"Ships",2)
// attemptBuildShipDirectly(1,0)
// approveContract("Timber",1,"Ships",0)
//
// //make sure you can't build ships in the harbor with no timber
// attemptToBuildShip(1,0)

//make sure you can build ships in the harbor with timber
approveContract("Timber",1,"Harbor",4)
buildShip(1,0)

//make sure you can revoke timber and it will fail to build ships at the harbor
// approveContract("Timber",1,"Harbor",0)
// attemptToBuildShip(1,0)


//buildShips(1,0,5)
//--------------------------------------------------------//

function localContractAddress(contract){
  return fs.readFileSync(contract+"/"+contract+".address").toString().trim()
}

function attemptBuildShipDirectly(accountindex,model){
  const tab = "\t\t";
  describe('#attemptBuildShipDirectly()', function() {
    it('should fail to build Ships directly', async function() {
      this.timeout(60000)
      try{
        const result = await clevis("contract","buildShip","Ships",accountindex,model)
        console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP WITHOUT HARBOR!".yellow)
      }catch(e){
        error = e.toString()
      }
      assert(error.indexOf("VM Exception while processing transaction: revert")>0)
    });
  });
}

function attemptToBuildShip(accountindex,model){
  const tab = "\t\t";
  describe('#attemptToBuildShip()', function() {
    it('should fail to build Ships at the Harbor', async function() {
      this.timeout(60000)
      try{
        const result = await clevis("contract","buildShip","Harbor",accountindex,model)
        console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP!".yellow)
      }catch(e){
        error = e.toString()
      }
      assert(error.indexOf("VM Exception while processing transaction: revert")>0)
    });
  });
}

function buildShip(accountindex,model){
  const tab = "\t\t";
  describe('#buildShips()', function() {
    it('should build Ships at the Harbor', async function() {
      this.timeout(60000)
      const result = await clevis("contract","buildShip","Harbor",accountindex,model)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      const ships = await clevis("contract","balanceOf","Ships",localContractAddress("Harbor"))
      assert(ships>=1,"Ships didn't build!?!")
      console.log(tab,"Harbor has "+((ships+"").yellow+" Ships"))
    });
  });
}

function buildShips(accountindex,model,amount){
  const tab = "\t\t";
  describe('#buildShips()', function() {
    it('should build Ships', async function() {
      this.timeout(60000)
      const result = await clevis("contract","buildShips","Ships",accountindex,model,amount)
      console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      const accounts = await clevis("accounts")
      const myShipCount = await clevis("contract","balanceOf","Ships",accounts[accountindex])
      assert(myShipCount>=amount,"Ships didn't build!?!")
      console.log(tab,accounts[accountindex].blue+" has "+((myShipCount+"").yellow+" Ships"))
    });
  });
}

function approveContract(contract,accountindex,toContract,amount){
  const tab = "\t\t";
  describe('#approve() '+contract.magenta, function() {
    it('should approve tokens', async function() {
      this.timeout(60000)
      const accounts = await clevis("accounts")
      let toContractAddress = localContractAddress(toContract)
      const result = await clevis("contract","approve",contract,accountindex,toContractAddress,amount)
      const allowance = await clevis("contract","allowance",contract,accounts[accountindex],toContractAddress)
      assert(allowance==amount,"Approve Failed!?!")
      console.log(tab,accounts[accountindex].blue+" approves "+toContractAddress.blue+" to transfer "+((allowance+"").yellow+" "+contract))
    });
  });
}

function testMint(contract,accountindex,toIndex,amount){
  const tab = "\t\t";
  describe('#testMint() '+contract.magenta, function() {
    it('should mint tokens', async function() {
      this.timeout(60000)
      const accounts = await clevis("accounts")
      const result = await clevis("contract","mint",contract,accountindex,accounts[toIndex],amount)
      const balance = await clevis("contract","balanceOf",contract,accounts[toIndex])
      assert(balance==amount,"Mint Failed!?!")
      console.log(tab,accounts[toIndex].blue+" has "+((balance+"").yellow+" "+contract))
    });
  });
}

function setPermission(contract,accountindex,permission,value){
  const tab = "\t\t";
  describe('#setPermission() '+contract.magenta, function() {
    it('should setPermission with main contract', async function() {
      this.timeout(60000)
      let contractAddress = localContractAddress(contract)
      const setResult = await clevis("contract","setPermission","Galleass",accountindex,contractAddress,web3.utils.fromAscii(permission),value)
      console.log(tab+contract+" permission ("+permission.magenta+"): "+value)
      const getResult = await clevis("contract","hasPermission","Galleass",contractAddress,web3.utils.fromAscii(permission))
      assert(""+getResult===value,"Contract Permission did not set correctly")
    });
  });
}

function setContract(contract,accountindex){
  const tab = "\t\t";
  describe('#setContract() '+contract.magenta, function() {
    it('should setContract with main contract', async function() {
      this.timeout(60000)
      let contractAddress = localContractAddress(contract)
      const setResult = await clevis("contract","setContract","Galleass",accountindex,web3.utils.fromAscii(contract),contractAddress)
      console.log(tab+contract+" address: "+contractAddress.blue)
      const getResult = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(contract))
      assert(getResult==contractAddress,"Contract Address did not set correctly")
      //finally, make sure the contract links back to the correct main galleass address
      const galleass = await clevis("contract","galleass",contract)
      assert(galleass==localContractAddress("Galleass"),"Galleass main address is wrong or contract isn't Galleasset")
    });
  });
}

function testContractDeploy(contract,accountindex){
  const tab = "\t\t";
  describe('#deploy() '+contract.magenta, function() {
    it('should deploy '+contract.magenta+' as account '+accountindex, async function() {
      this.timeout(60000)
      const result = await clevis("deploy",contract,accountindex)
      console.log(tab+"Address: "+result.contractAddress.blue)
      assert(result.contractAddress)
    });
  });
}

function testContractCompile(contract){
  const tab = "\t\t";
  describe('#compile() '+contract.magenta, function() {
    it('should compile '+contract.magenta+' contract to bytecode', async function() {
      this.timeout(10000)
      const result = await clevis("compile",contract)
      assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
      //console.log(result.contracts)
      let count = 0
      for(let c in result.contracts){
        console.log("\t\t"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
        //console.log("result.contracts[c].bytecode:",c,result.contracts)
        if(count++==0){
            assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
        }
      }
    });
  });
}
