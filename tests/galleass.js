const clevis = require("clevis")
const colors = require('colors')
const chai = require("chai")
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();
const fs = require('fs')
const Web3 = require('web3')
const clevisConfig = JSON.parse(fs.readFileSync("clevis.json").toString().trim())
web3 = new Web3(new Web3.providers.HttpProvider(clevisConfig.provider))
function localContractAddress(contract){
  return fs.readFileSync(contract+"/"+contract+".address").toString().trim()
}
function printTxResult(result){
  console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
}
function bigHeader(str){
  return "########### "+str+" "+Array(128-str.length).join("#")
}
function rand(min, max) {
  return Math.floor( Math.random() * (max - min) + min );
}
function loadAbi(contract){
  let abi = fs.readFileSync(contract+"/"+contract+".abi").toString().trim()
  //console.log(contract+" ABI:",abi.gray)
  fs.writeFileSync("app/src/"+contract+".abi.js","module.exports = "+abi);
}
const tab = "\t\t";

let TARGET_LOCATION
let TARGET_FISH
let BAIT

module.exports = {
  compile:(contract)=>{
    describe('#compile() '+contract.magenta, function() {
      it('should compile '+contract.magenta+' contract to bytecode', async function() {
        this.timeout(90000)
        const result = await clevis("compile",contract)
        assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
        let count = 0
        for(let c in result.contracts){
          console.log("\t\t"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
          if(count++==0){
              assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
          }
        }
      });
    });
  },
  deploy:(contract,accountindex)=>{
    describe('#deploy() '+contract.magenta, function() {
      it('should deploy '+contract.magenta+' as account '+accountindex, async function() {
        this.timeout(360000)
        const result = await clevis("deploy",contract,accountindex)
        printTxResult(result)
        console.log(tab+"Address: "+result.contractAddress.blue)
        assert(result.contractAddress)
      });
    });
  },

  setContract:(contract,accountindex)=>{
    describe('#setContract() '+contract.magenta, function() {
      it('should setContract with main contract', async function() {
        this.timeout(120000)
        let contractAddress = localContractAddress(contract)
        console.log(tab,"Setting "+contract+" in Galleass to "+contractAddress)
        const setResult = await clevis("contract","setContract","Galleass",accountindex,web3.utils.fromAscii(contract),contractAddress)
        printTxResult(setResult)
        const getResult = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(contract))
        assert(getResult==contractAddress,"Contract Address did not set correctly")
        //finally, make sure the contract links back to the correct main galleass address
        const galleass = await clevis("contract","galleass",contract)
        assert(galleass==localContractAddress("Galleass"),"Galleass main address is wrong or contract isn't Galleasset")
      });
    });
  },
  setPermission:(contract,accountindex,permission,value)=>{
    describe('#setPermission() '+contract.magenta, function() {
      it('should setPermission with main contract', async function() {
        this.timeout(120000)
        let contractAddress = localContractAddress(contract)
        const setResult = await clevis("contract","setPermission","Galleass",accountindex,contractAddress,web3.utils.fromAscii(permission),value)
        console.log(tab+contract+" permission ("+permission.cyan+"): "+value)
        const getResult = await clevis("contract","hasPermission","Galleass",contractAddress,web3.utils.fromAscii(permission))
        assert(""+getResult===value,"Contract Permission did not set correctly")
      });
    });
  },
  approveContract:(contract,accountindex,toContract,amount)=>{
    describe('#approve() '+contract.magenta, function() {
      it('should approve tokens', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let toContractAddress = localContractAddress(toContract)
        const result = await clevis("contract","approve",contract,accountindex,toContractAddress,amount)
        const allowance = await clevis("contract","allowance",contract,accounts[accountindex],toContractAddress)
        assert(allowance>=amount,"Approve Failed!?!")
        console.log(tab,accounts[accountindex].blue+" approves "+toContractAddress.blue+" to transfer "+((allowance+"").yellow+" "+contract))
      });
    });
  },
  testMint:(contract,accountindex,toIndex,amount)=>{
    describe('#testMint() '+contract.magenta, function() {
      it('should mint tokens', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        const result = await clevis("contract","mint",contract,accountindex,accounts[toIndex],amount)
        const balance = await clevis("contract","balanceOf",contract,accounts[toIndex])
        assert(balance>=amount,"Mint Failed!?!")
        console.log(tab,accounts[toIndex].blue+" has "+((balance+"").yellow+" "+contract))
      });
    });
  },
  buyShip:(accountindex,model)=>{
    describe('#buyShip()', function() {
      it('should buy ship from the Harbor', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        //const wei = await clevis("wei",ether,"ether")
        const wei = await clevis("contract","currentPrice","Harbor",model)
        const result = await clevis("contract","buyShip","Harbor",accountindex,wei,model)
        printTxResult(result)
        const ships = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
        console.log(tab,"Ships belonging to "+accounts[accountindex].blue+":",ships)
      });
    });
  },
  attemptBuyShipCheap:(accountindex,model)=>{
    describe('#buyShip()', function() {
      it('should fail to buy ship from the Harbor for half price', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        //const wei = await clevis("wei",ether,"ether")
        const wei = await clevis("contract","currentPrice","Harbor",model)/2;
        console.log(tab,"Attempting to buy ship for half price ("+(""+wei).magenta+")")
        let error
        try{
          const result = await clevis("contract","buyShip","Harbor",accountindex,wei,model)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUY HALF PRICED SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
        const ships = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
        console.log(tab,"Ships belonging to "+accounts[accountindex].blue+":",ships)
      });
    });
  },
  approveFirst:(contract,accountindex,toContract)=>{
    describe('#approveFirst() '+contract.magenta, function() {
      it('should approve first '+contract+' to be transferred', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let toContractAddress = localContractAddress(toContract)
        let tokens = await clevis("contract","shipsOfOwner",contract,accounts[accountindex])
        console.log(tab,"Approving token id "+(""+tokens[0]).magenta+" to be transferred by "+toContract+"...");
        const result = await clevis("contract","approve",contract,accountindex,toContractAddress,tokens[0])
        const allowance = await clevis("contract","allowance",contract,toContractAddress,tokens[0])
        assert(allowance===true)
        console.log(tab,accounts[accountindex].blue+" approves "+toContractAddress.blue+" to transfer Token #"+((tokens[0]+"").yellow))
      });
    });
  },
  sellFirstShip:(accountindex)=>{
    describe('#sellFirstShip()', function() {
      it('should sell first ship owned', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let ships = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
        console.log(tab,"Selling ship id "+(""+ships[0]).magenta+" back to the Harbor...");
        const result = await clevis("contract","sellShip","Harbor",accountindex,ships[0])
        printTxResult(result)
        let harborAddress = localContractAddress("Harbor")
        ships = await clevis("contract","shipsOfOwner","Ships",harborAddress)
        console.log(tab,"Ships belonging to "+harborAddress.blue+" (Harbor):",ships)
      });
    });
  },
  attemptToSellFirstShip:(accountindex)=>{
    describe('#attemptToSellFirstShip()', function() {
      it('should fail sell first ship', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let ships = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
        let error
        try{
          let fakeShip = ships[0];
          if(!fakeShip){
            fakeShip=1
          }
          console.log(tab,"Attempting to sell ship id "+(""+fakeShip).magenta+" back to the Harbor...");
          const result = await clevis("contract","sellShip","Harbor",accountindex,fakeShip)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO SELL SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }

      });
    });
  },
  buildShip:(accountindex,model)=>{
    describe('#buildShip()', function() {
      it('should build Ships at the Harbor', async function() {
        this.timeout(120000)
        const result = await clevis("contract","buildShip","Harbor",accountindex,model)
        printTxResult(result)
        const ships = await clevis("contract","balanceOf","Ships",localContractAddress("Harbor"))
        assert(ships>=1,"Ships didn't build!?!")
        console.log(tab,"Harbor has "+((ships+"").yellow+" Ships"))
      });
    });
  },
  attemptBuildShip:(accountindex,model)=>{
    describe('#attemptBuildShip()', function() {
      it('should fail to build Ships at the Harbor', async function() {
        this.timeout(120000)
        let error = ""
        try{
          const result = await clevis("contract","buildShip","Harbor",accountindex,model)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
      });
    });
  },
  buildShips:(accountindex,model,amount)=>{
    describe('#buildShips()', function() {
      it('should build Ships', async function() {
        this.timeout(120000)
        const result = await clevis("contract","buildShips","Ships",accountindex,model,amount)
        printTxResult(result)
        const accounts = await clevis("accounts")
        const myShipCount = await clevis("contract","balanceOf","Ships",accounts[accountindex])
        assert(myShipCount>=amount,"Ships didn't build!?!")
        console.log(tab,accounts[accountindex].blue+" has "+((myShipCount+"").yellow+" Ships"))
      });
    });
  },
  attemptBuildShipDirectly:(accountindex,model)=>{
    describe('#attemptBuildShipDirectly()', function() {
      it('should fail to build Ships directly', async function() {
        this.timeout(120000)
        let error = ""
        try{
          const result = await clevis("contract","buildShip","Ships",accountindex,model)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP WITHOUT HARBOR!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
      });
    });
  },
  attemptToBuildShip:(accountindex,model)=>{
    describe('#attemptToBuildShip()', function() {
      it('should fail to build Ships at the Harbor', async function() {
        this.timeout(120000)
        let error = ""
        try{
          const result = await clevis("contract","buildShip","Harbor",accountindex,model)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0,"NOT REVERT:"+(error.red))
        }
      });
    });
  },
  allowSpecies:(contract,accountindex)=>{
    describe('#allowSpecies() '+contract.magenta, function() {
      it('should allow species '+contract.magenta, async function() {
        this.timeout(120000)
        let contractAddress = localContractAddress(contract);
        const result = await clevis("contract","allowSpecies","Sea",accountindex,contractAddress)
        console.log(tab,result.transactionHash.gray,contractAddress.blue,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")
      });
    });
  },
  stock:(species,accountindex,amount)=>{
    describe('#stock() '+species.magenta, function() {
      it('should stock '+amount+' '+species.magenta+' as account '+accountindex, async function() {
        this.timeout(120000)
        let speciesAddress = localContractAddress(species);
        const result = await clevis("contract","stock","Sea",accountindex,speciesAddress,amount)
        console.log(tab,result.transactionHash.gray,speciesAddress.blue,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")
        assert(result.status=="0x1","Failed Transaction?")
      });
    });
  },
  attemptStock:(species,accountindex,amount)=>{
    describe('#stock() '+species.magenta, function() {
      it('should fail to stock '+amount+' '+species.magenta+' as account '+accountindex, async function() {
        this.timeout(120000)
        let speciesAddress = localContractAddress(species);
        let error = ""
        try{
          const result = await clevis("contract","stock","Sea",accountindex,speciesAddress,amount)
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO STOCK!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
      });
    });
  },
  cloud:(accountindex,image,speed)=>{
    const tab = "\t\t";
    describe('#cloud() ', function() {
      it('should add cloud', async function() {
        this.timeout(120000)
        let width = await clevis("contract","width","Sea")
        let location = rand(0,width);
        let result = await clevis("contract","addCloud","Sea",accountindex,location,speed,image)
        console.log(tab,(""+location).white,(""+speed).gray,result.transactionHash.gray,(""+result.gasUsed).yellow)
      });
    });
  },
  embarkWithFirst:(accountindex)=>{
    describe('#embark() ', function() {
      it('should embark (transfer first ship to sea)', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let tokens = await clevis("contract","shipsOfOwner","Ships",accounts[accountindex])
        console.log(tab,"Embarking with ship id "+(""+tokens[0]).magenta+"");
        let result = await clevis("contract","embark","Sea",accountindex,tokens[0])
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      });
    });
  },
  findFish:(accountindex)=>{
    describe('#findFish() ', function() {
      it('should find a fish', async function() {
        this.timeout(120000)

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
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

        assert(bestFish!=false,"NO FISH TO FIND!?")

        let location = await clevis("contract","fishLocation","Sea",bestFish)

        TARGET_LOCATION = location[0];
        TARGET_FISH = bestFish
        console.log("Best fish is "+bestFish.magenta+" at a distance ("+(""+bestDistance).green+") @ ",TARGET_LOCATION)
        assert(TARGET_LOCATION>0,"No Target Location found!?!")
      });
    });
  },
  setSailTowardFish:(accountindex)=>{
    describe('#setSailTowardFish() ', function() {
      it('should setSailTowardFish', async function() {
        this.timeout(120000)
        assert(TARGET_LOCATION>0,"We need to findFish before this function runs")

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
        let myShip = await clevis("contract","getShip","Sea",myAddress);

        let direction = myShip.location < TARGET_LOCATION

        console.log("\t\t Heading "+direction+" because I'm at "+myShip.location+" and I need to get to "+TARGET_LOCATION)

        let result = await clevis("contract","setSail","Sea",accountindex,""+direction)
        //console.log(result)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")

      });
    });
  },
  transactionsUntilAtFish:(accountindex)=>{
    describe('#transactionsUntilAtFish() ', function() {
      it('should add a new block to the chain', async function() {
        this.timeout(600000)

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
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
  },
  dropAnchor:(accountindex)=>{
    describe('#dropAnchor() ', function() {
      it('should dropAnchor', async function() {
        this.timeout(120000)
        let result = await clevis("contract","dropAnchor","Sea",accountindex)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  castLine:(accountindex)=>{
    describe('#castLine() ', function() {
      it('should castLine with random bait', async function() {
        this.timeout(120000)
        let web3 = new Web3()
        BAIT = web3.utils.sha3(Math.random()+Date.now()+"LIVEBAIT!");
        console.log(tab,"Using Bait:",BAIT.blue)
        let baitHash = web3.utils.sha3(BAIT);
        console.log(tab,"Bait hash:",baitHash.magenta)
        let result = await clevis("contract","castLine","Sea",accountindex,baitHash)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  reelIn(accountindex){
    describe('#reelIn() ', function() {
      it('should reelIn TARGET_FISH', async function() {
        this.timeout(120000)
        //run one transaction to make sure it's the next block
        let result = await clevis("send","0.1","1","2")
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)

        console.log(tab,"Reeling in fish: ",TARGET_FISH.magenta)
        result = await clevis("contract","reelIn","Sea",accountindex,TARGET_FISH,BAIT)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  transferAndCall:(contract,accountindex,toContract,amount,data)=>{
    describe('#transferAndCall() '+contract.magenta, function() {
      it('should transfer '+amount+' '+contract+' tokens to '+toContract+' and then call function '+data, async function() {
        this.timeout(120000)
        let toContractAddress = localContractAddress(toContract);
        console.log("Transferring "+amount+" "+contract+" to "+toContract+" ("+toContractAddress+") and then calling "+data)
        const result = await clevis("contract","transferAndCall",contract,accountindex,toContractAddress,amount,web3.utils.fromAscii(data))
        printTxResult(result)
        const events = await clevis("contract","eventTokensIncoming",toContract)
        console.log(events)
      });
    });
  },
  transferTokens:(contract,accountindex,toContract,amount)=>{
    describe('#transferTokens() '+contract.magenta, function() {
      it('should transfer '+amount+' '+contract+' tokens to '+toContract, async function() {
        this.timeout(120000)
        let toContractAddress = localContractAddress(toContract);
        console.log("Transferring "+amount+" "+contract+" to "+toContract+" ("+toContractAddress+")")
        const accounts = await clevis("accounts")
        const startingBalance = await clevis("contract","balanceOf",contract,accounts[accountindex])
        const startingBalanceTo = await clevis("contract","balanceOf",contract,toContractAddress)
        const result = await clevis("contract","transfer",contract,accountindex,toContractAddress,amount)
        printTxResult(result)
        const endingBalance = await clevis("contract","balanceOf",contract,accounts[accountindex])
        const endingBalanceTo = await clevis("contract","balanceOf",contract,toContractAddress)
        const balanceDifference = endingBalance-startingBalance;
        assert(balanceDifference == amount*-1,"The balance of "+accounts[accountindex]+" in contract "+contract+" went down "+balanceDifference+" but it should have gone down "+amount)
        const balanceDifferenceTo = endingBalanceTo-startingBalanceTo;
        assert(balanceDifferenceTo == amount,"The balance of "+toContractAddress+" in contract "+contract+" went up "+balanceDifferenceTo+" but it should have gone up "+amount)
      });
    });
  },
  transferTokensToAccount:(contract,accountindex,toAccount,amount)=>{
    describe('#transferTokens() '+contract.magenta, function() {
      it('should transfer '+amount+' '+contract+' tokens to '+toAccount, async function() {
        this.timeout(120000)
        console.log("Transferring "+amount+" "+contract+" to ("+toAccount+")")
        const accounts = await clevis("accounts")
        const startingBalance = await clevis("contract","balanceOf",contract,accounts[accountindex])
        const startingBalanceTo = await clevis("contract","balanceOf",contract,toAccount)
        const result = await clevis("contract","transfer",contract,accountindex,toAccount,amount)
        printTxResult(result)
        const endingBalance = await clevis("contract","balanceOf",contract,accounts[accountindex])
        const endingBalanceTo = await clevis("contract","balanceOf",contract,toAccount)
        const balanceDifference = endingBalance-startingBalance;
        assert(balanceDifference == amount*-1,"The balance of "+accounts[accountindex]+" in contract "+contract+" went down "+balanceDifference+" but it should have gone down "+amount)
        const balanceDifferenceTo = endingBalanceTo-startingBalanceTo;
        assert(balanceDifferenceTo == amount,"The balance of "+toAccount+" in contract "+contract+" went up "+balanceDifferenceTo+" but it should have gone up "+amount)
      });
    });
  },
  setFishPrice:(accountindex,species,price)=>{
    describe('#setFishPrice()', function() {
      it('should set price of species at the Fishmonger', async function() {
        this.timeout(120000)
        let speciesAddress = localContractAddress(species);
        const result = await clevis("contract","setPrice","Fishmonger",accountindex,speciesAddress,price)
        printTxResult(result)
        const newprice = await clevis("contract","price","Fishmonger",speciesAddress)
        assert(newprice==price,"Price at Fishmonger is "+newprice+" and it should be "+price)
      });
    });
  },
  sellFish:(accountindex,species,amount)=>{
    describe('#sellFish()', function() {
      it('should sell species to Fishmonger (and butcher and stock)', async function() {
        this.timeout(120000)
        let speciesAddress = localContractAddress(species);
        console.log("Selling "+amount+" "+speciesAddress+" fish to Fishmonger to butcher from "+accountindex)
        const result = await clevis("contract","sellFish","Fishmonger",accountindex,speciesAddress,amount)
        printTxResult(result)
      });
    });
  },

  publish:()=>{
    describe('#publish() ', function() {
      it('should inject contract address and abi into web app', async function() {
        this.timeout(120000)
        const fs = require("fs")

        let address = fs.readFileSync("Galleass/Galleass.address").toString().trim()
        console.log(tab,"ADDRESS:",address.blue)
        assert(address,"No Address!?")
        fs.writeFileSync("app/src/Address.js","module.exports = \""+address+"\"");

        let blockNumber = fs.readFileSync("Galleass/Galleass.blockNumber").toString().trim()
        console.log(tab,"blockNumber:",blockNumber.blue)
        assert(blockNumber,"No blockNumber!?")
        fs.writeFileSync("app/src/blockNumber.js","module.exports = \""+blockNumber+"\"");

        loadAbi("Galleass")
        loadAbi("Sea")
        loadAbi("Harbor")
        loadAbi("Ships")
        loadAbi("Timber")
        loadAbi("Catfish")
        loadAbi("Pinner")
        loadAbi("Redbass")
        loadAbi("Snark")
        loadAbi("Dangler")
        loadAbi("Copper")
        loadAbi("Fishmonger")
      });
    });
  },
  metamask:()=>{
    describe('#transfer() ', function() {
      it('should give metamask account some ether', async function() {
        this.timeout(600000)
        await clevis("sendTo","0.1","0","0x34aA3F359A9D614239015126635CE7732c18fDF3")
        await clevis("sendTo","0.1","0","0xB2ac59aE04d0f7310dC3519573BF70387b3b6E3a")
        await clevis("sendTo","0.1","0","0xfdE139e04963094650bAAD2686ca65A0cF04373C")
        await clevis("sendTo","0.1","0","0x1D1B2B691Aaf5E5490864ED91c818B200C0fA0E2")
        await clevis("sendTo","0.1","0","0x9921d057a7931b1ee5040ff82a3722dd3decb6cd")

        await clevis("sendTo","0.1","0","0x2a906694D15Df38F59e76ED3a5735f8AAbccE9cb")
        await clevis("sendTo","0.1","0","0x9319Bbb4e2652411bE15BB74f339b7F6218b2508")
        await clevis("sendTo","0.1","0","0xE68b423E49e13C704d2E403014a9C90d7961B98c")
        await clevis("sendTo","0.1","0","0x841b8C25Ce434B9Ca3ff12492a5468321e933A5b")
      });
    });
  },

  status:()=>{
    describe(bigHeader('STATUS'), function() {
      it('should display status', async function() {
        this.timeout(6000000)
        const accounts = await clevis("accounts")

        const galleassAddress = localContractAddress("Galleass")
        console.log(tab,"Galleass contract address is "+(galleassAddress+"").magenta)

        let FishmongerAddress = await checkContractDeployment("Fishmonger")
        let SeaAddress = await checkContractDeployment("Sea")

        let PinnerAddress = await checkContractDeployment("Pinner")
        await checkFishPrice("Pinner",PinnerAddress)
        let RedbassAddress = await checkContractDeployment("Redbass")
        await checkFishPrice("Redbass",RedbassAddress)
        let CatfishAddress = await checkContractDeployment("Catfish")
        await checkFishPrice("Catfish",CatfishAddress)
        let SnarkAddress = await checkContractDeployment("Snark")
        await checkFishPrice("Snark",SnarkAddress)
        let DanglerAddress = await checkContractDeployment("Dangler")
        await checkFishPrice("Dangler",DanglerAddress)

        await makeSureUserHasFish("Catfish",accounts[1])
        await makeSureContractHasPermission("Fishmonger",FishmongerAddress,"transferFish")
        await makeSureContractHasPermission("Fishmonger",FishmongerAddress,"mintFillet")

        let FilletAddress = await checkContractDeployment("Fillet")
        let CopperAddress = await checkContractDeployment("Copper")

        //await makeSureContractHasTokens("Account 1",accounts[1],"Copper")
        await makeSureContractHasTokens("Fishmonger",FishmongerAddress,"Copper")

      });
    });
  },
  redeploy:()=>{
    describe(bigHeader('DEPLOY'), function() {
      it('should deploy', async function() {
        this.timeout(6000000)
        const result = await clevis("test","deploy")
        assert(result==0,"deploy ERRORS")
      });
    });
    describe(bigHeader('TIMBER MINTING & BUILD SHIPS'), function() {
      it('should mintTimberBuildShips', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintTimberBuildShips")
        assert(result==0,"mintTimberBuildShips ERRORS")
      });
    });
    describe(bigHeader('MINT FISH AND STOCK'), function() {
      it('should mintCatfishAndStockSea', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintCatfishAndStockSea")
        assert(result==0,"mintCatfishAndStockSea ERRORS")
      });
    });
    describe(bigHeader('PUBLISH'), function() {
      it('should publish conract address to app', async function() {
        this.timeout(6000000)
        const result = await clevis("test","publish")
        assert(result==0,"publish ERRORS")
      });
    });
  },
  full:()=>{
    describe(bigHeader('COMPILE'), function() {
      it('should compile', async function() {
        this.timeout(6000000)
        const result = await clevis("test","compile")
        assert(result==0,"compile ERRORS")
      });
    });

    describe(bigHeader('DEPLOY'), function() {
      it('should deploy', async function() {
        this.timeout(6000000)
        const result = await clevis("test","deploy")
        assert(result==0,"deploy ERRORS")
      });
    });



    describe(bigHeader('TIMBER MINTING & BUILD SHIPS'), function() {
      it('should mintTimberBuildShips', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintTimberBuildShips")
        assert(result==0,"mintTimberBuildShips ERRORS")
      });
    });

    describe(bigHeader('BUY/SELL SHIPS'), function() {
      it('should buyAndSellShips', async function() {
        this.timeout(6000000)
        const result = await clevis("test","buyAndSellShips")
        assert(result==0,"buyAndSellShips ERRORS")
      });
    });

    describe(bigHeader('MINT FISH AND STOCK'), function() {
      it('should mintCatfishAndStockSea', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintCatfishAndStockSea")
        assert(result==0,"mintCatfishAndStockSea ERRORS")
      });
    });



    describe(bigHeader('EMBARK AND GO FISHING'), function() {
      it('should embarkAndGoFishing', async function() {
        this.timeout(6000000)
        const result = await clevis("test","embarkAndGoFishing")
        assert(result==0,"embarkAndGoFishing ERRORS")
      });
    });

    describe(bigHeader('MINT Copper AND TEST FISH MONGER'), function() {
      it('should mintCopperTestFishmonger', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintCopperTestFishmonger")
        assert(result==0,"mintCopperTestFishmonger ERRORS")
      });
    });

    describe(bigHeader('FINISHING TOUCHES'), function() {
      it('should finishingTouches', async function() {
        this.timeout(6000000)
        const result = await clevis("test","finishingTouches")
        assert(result==0,"finishingTouches ERRORS")
      });
    });

    describe(bigHeader('PUBLISH'), function() {
      it('should publish conract address to app', async function() {
        this.timeout(6000000)
        const result = await clevis("test","publish")
        assert(result==0,"publish ERRORS")
      });
    });

    describe(bigHeader('METAMASK'), function() {
      it('should give metamask users some fake ether', async function() {
        this.timeout(6000000)
        const result = await clevis("test","metamask")
        assert(result==0,"metamask ERRORS")
      });
    });


  },
}


checkContractDeployment = async (contract)=>{
  const localAddress = localContractAddress(contract)
  const address = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(contract))
  console.log(tab,contract.blue+" contract address is "+(localAddress+"").magenta+" deployed as: "+(address+"").magenta)
  assert(localAddress==address,contract.red+" isn't deployed correctly!?")
  return address
}

checkFishPrice = async (contract,contractAddress)=>{
  const price = await clevis("contract","price","Fishmonger",contractAddress)
  console.log(tab,contract.magenta+" is selling for "+(price+"").yellow)
  assert(price>0,contract.red+" doesn't have a price!")
}

makeSureUserHasFish = async (contract,account)=>{
  const getBalance = await clevis("contract","balanceOf",contract,account)
  console.log(tab,"Account "+account.magenta+" has "+getBalance+" "+contract.gray)
  assert(getBalance>0,account.red+" doesn't have any "+contract.red)
}

//hasPermission(address _contract, bytes32 _permission)
makeSureContractHasPermission = async (contract,contractAddress,permission)=>{
  const permissionBool = await clevis("contract","hasPermission","Galleass",contractAddress,web3.utils.fromAscii(permission))
  console.log(tab,"Contract "+contract.magenta+" (@ "+contractAddress+") permission "+permission+": "+permissionBool)
  assert(permissionBool,contract.red+" doesn't have permission "+permission.red)
}

makeSureContractHasTokens = async (contract,contractAddress,token)=>{
  const TokenBalance = await clevis("contract","balanceOf",token,contractAddress)
  console.log(tab,contract.magenta+" has "+TokenBalance+" "+token)
  assert(TokenBalance>0,contract.red+" doesn't have any "+token.red)
}
