const clevis = require("clevis")
//var parallel = require('mocha.parallel');
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
  if(!result||!result.transactionHash){
    console.log("ERROR".red,"MISSING TX HASH".yellow)
  }else{
    console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
  }
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
function getPaddedHexFromNumber(num,digits){
  let hexIs = web3.utils.numberToHex(num).replace("0x","");
  while(hexIs.length<digits){
    hexIs = "0"+hexIs
  }
  return hexIs
}

const tab = "\t\t";

let TARGET_LOCATION
let TARGET_FISH
let BAIT




module.exports = {
  web3:web3,
  localContractAddress,localContractAddress,

  reload:()=>{
    describe('#reload() ', function() {
      it('should force browser to reload', async function() {
        fs.writeFileSync("app/public/reload.txt",Date.now());
      });
    });
  },
  version:()=>{
    describe('#version() ', function() {
      it('should get version', async function() {
        this.timeout(90000)
        const result = await clevis("version")
        console.log(result)
      });
    });
  },
  blockNumber:()=>{
    describe('#blockNumber() ', function() {
      it('should get blockNumber', async function() {
        this.timeout(90000)
        const result = await clevis("blockNumber")
        console.log(result)
      });
    });
  },
  compile:(contract)=>{
    describe('#compile() '+contract.magenta, function() {
      it('should compile '+contract.magenta+' contract to bytecode', async function() {
        this.timeout(90000)
        const result = await clevis("compile",contract)

        console.log(result)

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
  /*compileBatch:(contracts)=>{
    parallel('#compile() contracts', function() {
      for(let contractIndex in contracts){
        it('should compile '+contracts[contractIndex].magenta+' contract to bytecode', async function() {
          this.timeout(90000)
          const result = await clevis("compile",contracts[contractIndex])
          console.log(result)
          assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
          let count = 0
          for(let c in result.contracts){
            console.log("\t\t"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
            if(count++==0){
                assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
            }
          }
        });
      }
    });
  },*/
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
  },/*
  deployBatch:(contracts,accountindex)=>{
    describe('#deploy batch', function() {
      it('should deploy batch of contracts', async function() {
        for(let c in contracts){
          this.timeout(360000)
          const result = await clevis("deploy",contracts[c],accountindex)
          printTxResult(result)
          console.log(tab+"Address: "+result.contractAddress.blue)
          assert(result.contractAddress)
        }
      });
    });
  },*/

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
  setLibrary:(contract,accountindex)=>{
    describe('#setLibrary() '+contract.magenta, function() {
      it('should setLibrary with main contract', async function() {
        this.timeout(120000)
        let contractAddress = localContractAddress(contract)
        console.log(tab,"Setting "+contract+" in Galleass to "+contractAddress)
        const setResult = await clevis("contract","setContract","Galleass",accountindex,web3.utils.fromAscii(contract),contractAddress)
        printTxResult(setResult)
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
  mintTo:(contract,accountindex,toAddress,amount)=>{
    describe('#testMintTo() '+contract.magenta, function() {
      it('should mint '+contract.magenta+' to address '+toAddress.blue, async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        const result = await clevis("contract","mint",contract,accountindex,toAddress,amount)
        const balance = await clevis("contract","balanceOf",contract,toAddress)
        assert(balance>=amount,"Mint Failed!?!")
        console.log(tab,toAddress.blue+" has "+((balance+"").yellow+" "+contract))
      });
    });
  },
  //ownerCreateCitizen(address owner,uint16 _x, uint16 _y, uint8 _tile,bytes32 genes, bytes32 characteristics)
  //createCitizenAtTileType:(0,genes,characteristics,building)
  createCitizenAtTileType:(accountindex,genes,characteristics,building,status)=>{
    describe('#createCitizenAtTileType() ', function() {
      it('should create a citizen at a specific tile...', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let mainLand = await getMainLand();
        const contractAddress = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(building))
        let tile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii(building))
        let found = await searchLandFromCenterOut(mainLand,9,tile)
        console.log(tab,"Found "+building+" tile at:",mainLand[0],mainLand[1],found)
        const result = await clevis("contract","ownerCreateCitizen","CitizensLib",accountindex,contractAddress,mainLand[0],mainLand[1],found,genes,characteristics)
        printTxResult(result)
        //const result = await clevis("contract","ownerSetStatus","CitizensLib",accountindex,1,tile)
        //printTxResult(result)
      });
    });
  },
  setShipPrice:(accountindex,model,ether)=>{
    describe('#setShipPrice()', function() {
      it('should buy ship from the Harbor', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let mainLand = await getMainLand();
        let harborTile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii("Harbor"))
        let found = await searchLandFromCenterOut(mainLand,9,harborTile)
        console.log(tab,"Found harbor tile at:",mainLand[0],mainLand[1],found)
        //setPrice(uint16 _x,uint16 _y,uint8 _tile,bytes32 model,uint256 amount)
        const result = await clevis("contract","setPrice","Harbor",accountindex,mainLand[0],mainLand[1],found,web3.utils.fromAscii(model),web3.utils.toWei(ether,"ether"))
        printTxResult(result)
        const currentPrice = await clevis("contract","currentPrice","Harbor",mainLand[0],mainLand[1],found,web3.utils.fromAscii(model));
        const priceInEther = web3.utils.fromWei(currentPrice,"ether")
        console.log(tab,"The currentPrice for a "+model.blue+" at the",mainLand[0],mainLand[1],found,"Harbor is",priceInEther.toString().green,"ETH")
        assert(ether==priceInEther,"Price did not set correctly.")
      });
    });
  },
  buyShip:(accountindex,model)=>{
    describe('#buyShip()', function() {
      it('should buy ship from the Harbor', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let mainLand = await getMainLand();
        let harborTile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii("Harbor"))
        let found = await searchLandFromCenterOut(mainLand,9,harborTile)
        console.log(tab,"Found harbor tile at:",mainLand[0],mainLand[1],found)
        const currentPrice = await clevis("contract","currentPrice","Harbor",mainLand[0],mainLand[1],found,web3.utils.fromAscii(model));
        // buyShip(uint16 _x,uint16 _y,uint8 _tile,bytes32 model)
        const result = await clevis("contract","buyShip","Harbor",accountindex,currentPrice,mainLand[0],mainLand[1],found,web3.utils.fromAscii(model))
        printTxResult(result)
        const ships = await clevis("contract","tokensOfOwner","Dogger",accounts[accountindex])
        console.log(tab,"Ships (model "+model+") belonging to "+accounts[accountindex].blue+":",ships)
      });
    });
  },
  attemptBuyShipCheap:(accountindex,model)=>{
    describe('#buyShip()', function() {
      it('should fail to buy ship from the Harbor for half price', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        //const wei = await clevis("wei",ether,"ether")
        const wei = await clevis("contract","currentPrice","Harbor",web3.utils.fromAscii(model))/2;
        console.log(tab,"Attempting to buy ship for half price ("+(""+wei).magenta+")")
        let error
        try{
          const result = await clevis("contract","buyShip","Harbor",accountindex,wei,web3.utils.fromAscii(model))
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUY HALF PRICED SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
        const ships = await clevis("contract","tokensOfOwner",model,accounts[accountindex])
        console.log(tab,"Ships (model "+model+") belonging to "+accounts[accountindex].blue+":",ships)
      });
    });
  },
  approveFirst:(contract,accountindex,toContract)=>{
    describe('#approveFirst() '+contract.magenta, function() {
      it('should approve first '+contract+' to be transferred', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let toContractAddress = localContractAddress(toContract)
        let tokens = await clevis("contract","tokensOfOwner",contract,accounts[accountindex])
        console.log(tab,"Approving token id "+(""+tokens[0]).magenta+" (type "+contract+") to be transferred by "+toContract+"...");
        const result = await clevis("contract","approve",contract,accountindex,toContractAddress,tokens[0])
        const allowance = await clevis("contract","allowance",contract,toContractAddress,tokens[0])
        assert(allowance===true)
        console.log(tab,accounts[accountindex].blue+" approves "+toContractAddress.blue+" to transfer Token #"+((tokens[0]+"").yellow))
      });
    });
  },
  sellFirstShip:(accountindex,model)=>{
    describe('#sellFirstShip()', function() {
      it('should sell first ship owned', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let ships = await clevis("contract","tokensOfOwner",model,accounts[accountindex])
        console.log(tab,"Selling ship id "+(""+ships[0]).magenta+" (model "+model+") back to the Harbor...");
        const result = await clevis("contract","sellShip","Harbor",accountindex,ships[0],web3.utils.fromAscii(model))
        printTxResult(result)
        let harborAddress = localContractAddress("Harbor")
        ships = await clevis("contract","tokensOfOwner",model,harborAddress)
        console.log(tab,"Ships (model "+model+") belonging to "+harborAddress.blue+" (Harbor):",ships)
      });
    });
  },
  attemptToSellFirstShip:(accountindex,model)=>{
    describe('#attemptToSellFirstShip()', function() {
      it('should fail sell first ship', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        let ships = await clevis("contract","tokensOfOwner",model,accounts[accountindex])
        let error
        try{
          let fakeShip = ships[0];
          if(!fakeShip){
            fakeShip=1
          }
          console.log(tab,"Attempting to sell ship id "+(""+fakeShip).magenta+" back to the Harbor...");
          const result = await clevis("contract","sellShip","Harbor",accountindex,fakeShip,web3.utils.fromAscii(model))
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
        let mainLand = await getMainLand();
        let harborTile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii("Harbor"))
        let found = await searchLandFromCenterOut(mainLand,9,harborTile)
        console.log(tab,"Found harbor tile at:",mainLand[0],mainLand[1],found)
        const result = await clevis("contract","buildShip","Harbor",accountindex,mainLand[0],mainLand[1],found,web3.utils.fromAscii(model))
        printTxResult(result)
        //countShips(uint16 _x,uint16 _y,uint8 _tile,bytes32 _model)
        const ships = await clevis("contract","countShips","Harbor",mainLand[0],mainLand[1],found,web3.utils.fromAscii(model))
        assert(ships>=1,"Dogger didn't build!?!")
        console.log(tab,"Harbor @ "+mainLand[0]+","+mainLand[1]+","+found+" has "+((ships+"").yellow+" "+model+"(s)"))
      });
    });
  },
  attemptToBuildShip:(accountindex,model)=>{
    describe('#attemptToBuildShip()', function() {
      it('should fail to build Ships at the Harbor', async function() {
        this.timeout(120000)
        let error = ""
        try{
          const result = await clevis("contract","buildShip","Harbor",accountindex,web3.utils.fromAscii(model))
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP!".yellow)
        }catch(e){
          error = e.toString()
          assert(error.indexOf("VM Exception while processing transaction: revert")>0,"NOT REVERT:"+(error.red))
        }
      });
    });
  },
  attemptBuildShipDirectly:(accountindex,model)=>{
    describe('#attemptBuildShipDirectly()', function() {
      it('should fail to build Ships directly', async function() {
        this.timeout(120000)
        let error = ""
        try{
          const result = await clevis("contract","build",model,accountindex,web3.utils.fromAscii(model))
          assert(!result.status,"Transaction status is 1, should be 0")
          if(result.status) console.log(tab,"WARNING".red,"WAS ABLE TO BUILD SHIP WITHOUT HARBOR!".yellow)
        }catch(e){
          error = e.toString()
          //console.log(error.red)
          assert(error.indexOf("VM Exception while processing transaction: revert")>0)
        }
      });
    });
  },
  shouldNotHaveExperience:(accountindex,milestone)=>{
    describe('#shouldNotHaveExperience() ', function() {
      it('should Not Have Experience', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        const setResult = await clevis("contract","experience","Experience",accounts[accountindex],milestone)
        assert(setResult==false,"Account should not have experience but it does!")
      });
    });
  },
  shouldHaveExperience:(accountindex,milestone)=>{
    describe('#shouldHaveExperience() ', function() {
      it('should Have Experience', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")
        const setResult = await clevis("contract","experience","Experience",accounts[accountindex],milestone)
        assert(setResult==true,"Account should have experience but it doesn't!")
      });
    });
  },
  allowSpecies:(contract,accountindex)=>{
    describe('#allowSpecies() '+contract.magenta, function() {
      it('should allow species '+contract.magenta, async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        let contractAddress = localContractAddress(contract);
        const result = await clevis("contract","allowSpecies","Bay",accountindex,mainLand[0],mainLand[1],contractAddress)
        console.log(tab,result.transactionHash.gray,contractAddress.blue,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")
      });
    });
  },
  stock:(species,accountindex,amount)=>{
    describe('#stock() '+species.magenta, function() {
      it('should stock '+amount+' '+species.magenta+' as account '+accountindex, async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        let speciesAddress = localContractAddress(species);
        console.log(mainLand[0],mainLand[1],speciesAddress,amount)
        const result = await clevis("contract","stock","Bay",accountindex,mainLand[0],mainLand[1],speciesAddress,amount)
        console.log(tab,result.transactionHash.gray,speciesAddress.blue,(""+result.gasUsed).yellow)
        assert(result.transactionHash,"No transaction hash!?")
        //console.log("RESULT:",result)
        assert(result.status=="0x01"||result.status=="0x1","Failed Transaction?")
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
          const result = await clevis("contract","stock","Bay",accountindex,speciesAddress,amount)
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
        let mainLand = await getMainLand();
        let width = await clevis("contract","width","Bay")
        let location = rand(0,width);
        let result = await clevis("contract","addCloud","Sky",accountindex,mainLand[0],mainLand[1],location,speed,image)
        console.log(tab,(""+location).white,(""+speed).gray,result.transactionHash.gray,(""+result.gasUsed).yellow)
      });
    });
  },
  embarkWithFirst:(accountindex,model)=>{
    describe('#embark() ', function() {
      it('should embark (transfer first ship to sea)', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        const accounts = await clevis("accounts")
        let tokens = await clevis("contract","tokensOfOwner",model,accounts[accountindex])
        console.log(tab,"Embarking with ship id "+(""+tokens[0]).magenta+" (model "+model+")");
        let result = await clevis("contract","embark","Bay",accountindex,mainLand[0],mainLand[1],tokens[0])
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      });
    });
  },
  findFish:(accountindex)=>{
    describe('#findFish() ', function() {
      it('should find a fish', async function() {
        this.timeout(120000)

        let mainLand = await getMainLand();

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
        let myShip = await clevis("contract","getShip","Bay",mainLand[0],mainLand[1],myAddress);

        console.log("\t\tFinding a fish for "+myAddress.magenta+" @ "+myShip.location+"...");

        let result = await clevis("contract","eventFish","Bay")
        let fish = [];
        for(let f in result){
          if(result[f].returnValues.x==mainLand[0]&&result[f].returnValues.y==mainLand[1]){
            let id = result[f].returnValues.id;
            let timestamp = result[f].returnValues.timestamp;
            let species = result[f].returnValues.species;
            if( !fish[id] || fish[id].timestamp < timestamp){
              fish[id] = {timestamp:timestamp,species:species}
            }
          }
        }

        let bestFish = false
        let bestDistance = 9999999

        for(let id in fish){
          let species = fish[id].species;
          if("0x0000000000000000000000000000000000000000"!=species){
            let location = await clevis("contract","fishLocation","Bay",id);
            console.log(id.white,species.gray,location)
            let thisDistance = Math.abs( myShip.location - location[0])
            if( thisDistance < bestDistance){
              bestDistance=thisDistance
              bestFish=id
            }
          }
        }

        assert(bestFish!=false,"NO FISH TO FIND!?")

        let location = await clevis("contract","fishLocation","Bay",bestFish)

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

        let mainLand = await getMainLand();

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
        let myShip = await clevis("contract","getShip","Bay",mainLand[0],mainLand[1],myAddress);

        let direction = myShip.location < TARGET_LOCATION

        console.log("\t\t Heading "+direction+" because I'm at "+myShip.location+" and I need to get to "+TARGET_LOCATION)

        let result = await clevis("contract","setSail","Bay",accountindex,mainLand[0],mainLand[1],""+direction)
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

        let mainLand = await getMainLand();

        let accounts = await clevis("accounts")
        let myAddress = accounts[accountindex];
        //console.log("My address:",myAddress)
        let myShip = await clevis("contract","getShip","Bay",mainLand[0],mainLand[1],myAddress);
        //console.log(myShip)
        console.log("\t\t Heading "+myShip.direction+" because ("+myAddress+") is at "+myShip.location+" and I need to get to "+TARGET_LOCATION)

        if(!myShip.direction){
          while( myShip.location > TARGET_LOCATION){
            let result = await clevis("send","0.0001","1","2")
            console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
            myShip = await clevis("contract","getShip","Bay",mainLand[0],mainLand[1],myAddress);
          }
        }else{
          while( myShip.location < TARGET_LOCATION){
            let result = await clevis("send","0.0001","1","2")
            console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
            myShip = await clevis("contract","getShip","Bay",mainLand[0],mainLand[1],myAddress);
          }
        }
      });
    });
  },
  dropAnchor:(accountindex)=>{
    describe('#dropAnchor() ', function() {
      it('should dropAnchor', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();

        let result = await clevis("contract","dropAnchor","Bay",accountindex,mainLand[0],mainLand[1])
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  castLine:(accountindex)=>{
    describe('#castLine() ', function() {
      it('should castLine with random bait', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        let web3 = new Web3()
        BAIT = web3.utils.sha3(Math.random()+Date.now()+"LIVEBAIT!");
        console.log(tab,"Using Bait:",BAIT.blue)
        let baitHash = web3.utils.sha3(BAIT);
        console.log(tab,"Bait hash:",baitHash.magenta)
        let result = await clevis("contract","castLine","Bay",accountindex,mainLand[0],mainLand[1],baitHash)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  reelIn(accountindex){
    describe('#reelIn() ', function() {
      it('should reelIn TARGET_FISH', async function() {
        this.timeout(120000)
        //run one transaction to make sure it's the next block
        let result = await clevis("send","0.001","1","2")
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
        let mainLand = await getMainLand();
        console.log(tab,"Reeling in fish: ",TARGET_FISH.magenta)
        result = await clevis("contract","reelIn","Bay",accountindex,mainLand[0],mainLand[1],TARGET_FISH,BAIT)
        console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
      })
    })
  },
  transferAndCall:(contract,accountindex,toContract,amount,data)=>{
    describe('#transferAndCall() '+contract.magenta, function() {
      it('should transfer '+amount+' '+contract.yellow+' tokens to '+toContract+' and then call receiver function with data:'+data.blue, async function() {
        this.timeout(120000)

        let mainLand = await getMainLand();

        let toContractTileType = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii(toContract))

        let found = await searchLandFromCenterOut(mainLand,9,toContractTileType)
        console.log(tab,"Found tiletype "+toContractTileType+" at:",mainLand[0],mainLand[1],found)

        let xHex = getPaddedHexFromNumber(mainLand[0],4)
        let yHex = getPaddedHexFromNumber(mainLand[1],4)
        let tileHex = getPaddedHexFromNumber(found,2)

        data = data+xHex+yHex+tileHex
        let toContractAddress = localContractAddress(toContract);
        console.log("Transferring "+amount+" "+contract+" to "+toContract+" ("+toContractAddress+") and then calling receiver with data: "+data)
        const result = await clevis("contract","transferAndCall",contract,accountindex,toContractAddress,amount,data)
        printTxResult(result)
        const events = await clevis("contract","eventTokenTransfer",toContract)
        console.log(events[events.length-1].returnValues)
      });
    });
  },
  buyLand:(accountindex,amount,tileName)=>{
    describe('#buyLand()', function() {
      it('should transfer '+amount+' Copper to LandLib to buy the tile '+tileName, async function() {
        this.timeout(120000)

        let contract = "Copper"
        let toContract = "LandLib"
        let data = "0x01"

        let mainLand = await getMainLand();


        let buyTileType = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii(tileName))

        let found = await searchLandFromCenterOut(mainLand,9,buyTileType)
        console.log(tab,"Found tiletype "+buyTileType+" at:",mainLand[0],mainLand[1],found)

        let xHex = getPaddedHexFromNumber(mainLand[0],4)
        let yHex = getPaddedHexFromNumber(mainLand[1],4)
        let tileHex = getPaddedHexFromNumber(found,2)

        data = data+xHex+yHex+tileHex
        let toContractAddress = localContractAddress(toContract);
        console.log("Transferring "+amount+" "+contract+" to "+toContract+" ("+toContractAddress+") and then calling receiver with data: "+data)
        const result = await clevis("contract","transferAndCall",contract,accountindex,toContractAddress,amount,data)
        printTxResult(result)
        const events = await clevis("contract","eventTokenTransfer",toContract)
        console.log(events[events.length-1].returnValues)
      });
    });
  },
  transferTokens:(contract,accountindex,toContract,amount)=>{
    describe('#transferTokens() '+contract.magenta, function() {
      it('should transfer '+amount+' '+contract+' tokens to '+toContract, async function() {
        this.timeout(120000)
        let toContractAddress = localContractAddress(toContract);
        console.log(tab,"Transferring "+amount+" "+contract+" to "+toContract+" ("+toContractAddress+")")
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

        let mainLand = await getMainLand();
        let fishmongerTile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii("Fishmonger"))
        let found = await searchLandFromCenterOut(mainLand,9,fishmongerTile)
        console.log(tab,"Found fishmonger tile at:",mainLand[0],mainLand[1],found)
        let speciesAddress = localContractAddress(species);
        console.log("setPrice()",accountindex,mainLand[0],mainLand[1],found,speciesAddress,price)
        const result = await clevis("contract","setPrice","Fishmonger",accountindex,mainLand[0],mainLand[1],found,speciesAddress,price)
        printTxResult(result)
        const newprice = await clevis("contract","price","Fishmonger",mainLand[0],mainLand[1],found,speciesAddress)
        assert(newprice==price,"Price at Fishmonger is "+newprice+" and it should be "+price)
      });
    });
  },
  sellFish:(accountindex,species,amount)=>{
    describe('#sellFish()', function() {
      it('should sell species to Fishmonger (and butcher and stock)', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        let fishmongerTile = await clevis("contract","tileTypes","LandLib",web3.utils.fromAscii("Fishmonger"))
        let found = await searchLandFromCenterOut(mainLand,9,fishmongerTile)
        console.log(tab,"Found fishmonger tile at:",mainLand[0],mainLand[1],found)
        let speciesAddress = localContractAddress(species);
        console.log(tab,"Selling "+amount+" "+speciesAddress+" fish to Fishmonger @ "+mainLand[0]+","+mainLand[1]+","+found+" to butcher from "+accountindex)
        const result = await clevis("contract","sellFish","Fishmonger",accountindex,mainLand[0],mainLand[1],found,speciesAddress,amount)
        printTxResult(result)
      });
    });
  },
  buyFillet:(accountindex,amount)=>{
    describe('#buyFillet()', function() {
      it('should buy fillet from Fishmonger', async function() {
        this.timeout(120000)
        console.log(tab,"Buying "+amount+" fillets from Fishmonger as "+accountindex)
        const result = await clevis("contract","buyFillet","Fishmonger",accountindex,amount)
        printTxResult(result)
      });
    });
  },
  generateLand:(accountindex)=>{
    describe('#generateLand()', function() {
      it('should generate an island', async function() {
        this.timeout(120000)
        const result = await clevis("contract","generateLand","LandLib",accountindex)
        printTxResult(result)
      });
    });
  },
  setMiddleMostLandToMain:(accountindex)=>{
    describe('#setMiddleMostLandToMain()', function() {
      it('should setMiddleMostLandToMain', async function() {
        this.timeout(120000)
        const events = await clevis("contract","eventTokenTransfer",toContract)
        console.log(events[events.length-1].returnValues)
      });
    });
  },
  setLastTileAsMain:(accountindex)=>{
    describe('#setLastTileAsMain()', function() {
      it('should setLastTileAsMain', async function() {
        this.timeout(120000)

        let eventResult = await clevis("contract","eventLandGenerated","Land")
        let x=0;
        let y=0;
        for(let e in eventResult){
          console.log(tab,"eventLandGenerated:",eventResult[e].returnValues)
          x = eventResult[e].returnValues._x;
          y = eventResult[e].returnValues._y;
        }
        assert(x!=0&&y!=0,"There are no land generate events!?")
        console.log("Setting main x,y to",x,y)
        const result = await clevis("contract","setMainLocation","Land",accountindex,x,y)
        printTxResult(result)
      });
    });
  },
  editMiddleTile:(accountindex,name,number,optionalAddress)=>{
    describe('#editTile()', function() {
      it('should build a tile at the center most open main tile', async function() {
        this.timeout(120000)

        let mainLand = await getMainLand();
        console.log("mainLand",mainLand)

        console.log(tab,"optionalAddress:",optionalAddress)

        let address = optionalAddress
        if(typeof optionalAddress == "undefined"){
          address = localContractAddress(name);
          console.log(tab,name+" address is ",address.blue)
        }


        let openMainTile = await searchLandFromCenterOut(mainLand,9,1)
        console.log(tab,"Building "+name+" at tile ",openMainTile," on island ",mainLand)

        //clevis contract editTile Land 0 9 100 0x0
        const result = await clevis("contract","editTile","Land",accountindex,mainLand[0],mainLand[1],openMainTile,number,address)
        printTxResult(result)

        const atThisTileNow = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],openMainTile)
        assert(atThisTileNow==number,name.red+" didn't get built in middle of land?!?")

      });
    });
  },
  transferTile:(accountindex,x,y,tileIndex,newAccountIndex)=>{
    describe('#transferTile()', function() {
      it('should transfer ownership of a tile from one account to another', async function() {
        this.timeout(120000)

        const accounts = await clevis("accounts")
        const tileType = await clevis("contract","tileTypeAt","Land",x,y,tileIndex)
        console.log(tab,"Transferring tile at "+x+","+y+" index "+tileIndex+" (type "+tileType+") from account "+accountindex+"("+accounts[accountindex].blue+") to account "+newAccountIndex+"("+accounts[newAccountIndex].blue+")")

        assert(accountindex!=newAccountIndex,"Don't transfer to the same account.")
        //clevis contract owners Land 0
        const currentOwnerStart = await clevis("contract","ownerAt","Land",x,y,tileIndex)
        assert(currentOwnerStart==accounts[accountindex],"Account index "+accountindex+" doesn't own tile "+tileIndex+" at "+x+","+y)
        ////transferTile(uint16 _x,uint16 _y,uint8 _tile,address _newOwner)
        const result = await clevis("contract","transferTile","Land",accountindex,x,y,tileIndex,accounts[newAccountIndex])
        printTxResult(result)
        const currentOwnerEnd = await clevis("contract","ownerAt","Land",x,y,tileIndex)
        console.log(tab,"Owner of tile "+tileIndex+" is "+currentOwnerEnd)
        assert(currentOwnerEnd==accounts[newAccountIndex],"transfer tile FAILED, accounts["+newAccountIndex+"] ("+accounts[newAccountIndex]+") doesn't own tile "+tileIndex+" at "+x+","+y)
      });
    });
  },
  setPriceOfTile:(accountindex,x,y,tileIndex,price)=>{
    describe('#setPriceOfTile()', function() {
      it('should set the price of a tile', async function() {
        /*  mapping (uint16 => mapping (uint16 => uint8[18])) public tileTypeAt;
          mapping (uint16 => mapping (uint16 => address[18])) public contractAt;
          mapping (uint16 => mapping (uint16 => address[18])) public ownerAt;
          mapping (uint16 => mapping (uint16 => uint256[18])) public priceAt;*/
        this.timeout(120000)
        const accounts = await clevis("accounts")

        const tileType = await clevis("contract","tileTypeAt","Land",x,y,tileIndex)
        console.log(tab,"Setting price of tile at index "+tileIndex+" at "+x+","+y+" (type "+tileType+") from account "+accountindex+"("+accounts[accountindex].blue+") to "+(""+price).cyan+"")

        const currentOwnerStart = await clevis("contract","ownerAt","Land",x,y,tileIndex)
        assert(currentOwnerStart==accounts[accountindex],"Account index "+accountindex+" doesn't own tile "+tileIndex+" at "+x+","+y)

        //clevis contract setPrice Land 1 0 1
        const result = await clevis("contract","setPrice","Land",accountindex,x,y,tileIndex,price)
        printTxResult(result)

        const currentPrice = await clevis("contract","priceAt","Land",x,y,tileIndex)
        assert(currentPrice==price,"Failed to set price of tile "+tileIndex+" at "+x+","+y+" to "+price+" (current price is "+currentPrice+")")

      });
    });
  },
  setContractOfTile:(accountindex,x,y,tileIndex,name)=>{
    describe('#setContractOfTile()', function() {
      it('should set the contract of a tile', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")

        const contractAddress = await clevis("contract","getContract","Galleass",web3.utils.fromAscii(name))

        const tileType = await clevis("contract","tileTypeAt","Land",x,y,tileIndex)
        console.log(tab,"Setting contract of tile at index "+tileIndex+" at "+x+","+y+" (type "+tileType+") from account "+accountindex+"("+accounts[accountindex].blue+") to "+(""+contractAddress).cyan+"")

        const result = await clevis("contract","editTile","Land",accountindex,x,y,tileIndex,tileType,contractAddress)
        printTxResult(result)

      });
    });
  },
  buyTile:(accountindex,x,y,tileIndex)=>{
    describe('#buyTile()', function() {
      it('should buy a tile for copper', async function() {
        this.timeout(120000)
        const accounts = await clevis("accounts")

        const currentPrice = await clevis("contract","priceAt","Land",x,y,tileIndex)
        const currentOwnerStart = await clevis("contract","ownerAt","Land",x,y,tileIndex)
        assert(currentOwnerStart!=accounts[accountindex],"Account index "+accountindex+" is already the owner of "+tileIndex+" at "+x+","+y)

        const tileType = await clevis("contract","tileTypeAt","Land",x,y,tileIndex)
        console.log(tab,"Buying tile at index "+tileIndex+" (type "+tileType+") from account "+currentOwnerStart+" for "+(""+currentPrice).cyan+" Copper")

        //clevis contract buyTile Land 0 0
        const result = await clevis("contract","buyTile","Land",accountindex,x,y,tileIndex)
        printTxResult(result)

        const currentOwnerEnd = await clevis("contract","ownerAt","Land",x,y,tileIndex)
        assert(currentOwnerEnd==accounts[accountindex],"Failed to buy tile "+tileIndex+" at "+x+","+y+" at price "+currentPrice+" from "+currentOwnerStart+"")

      });
    });
  },
  transferFirstLandTile:(accountindex,newAccountIndex)=>{
    describe('#transferFirstLandTile()', function() {
      it('should transfer ownership of a tile from one account to another', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        const firstLandTile = await findFirstLandTile(mainLand);
        module.exports.transferTile(accountindex,mainLand[0],mainLand[1],firstLandTile,newAccountIndex)
      });
    });
  },
  setPriceOfFirstLandTile:(accountindex,price)=>{
    describe('#setPriceOfFirstLandTile()', function() {
      it('should transfer ownership of a tile from one account to another', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        const firstLandTile = await findFirstLandTile(mainLand);
        module.exports.setPriceOfTile(accountindex,mainLand[0],mainLand[1],firstLandTile,price)
      });
    });
  },
  setPriceOfAllOpenLandTiles:(accountindex,price)=>{
    describe('#setPriceOfAllOpenLandTiles()', function() {
      it('should set the price of all open land tiles', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        for(let i=0;i<18;i++){
          const tileType = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],i)
          if(tileType<100) {
            module.exports.setPriceOfTile(accountindex,mainLand[0],mainLand[1],i,price)
          }
        }
      });
    });
  },
  buyFirstLandTile:(accountindex)=>{
    describe('#buyFirstLandTile()', function() {
      it('should by first land tile', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();
        const firstLandTile = await findFirstLandTile(mainLand);
        module.exports.buyTile(accountindex,mainLand[0],mainLand[1],firstLandTile)
      });
    });
  },
  setPriceOfFirstTileOfType:(accountindex,tiletype,price)=>{
    describe('#setPriceOfFirstTileOfType()', function() {
      it('should set the price of the first tile of a specific type', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();

        let found = await searchLandFromCenterOut(mainLand,9,tiletype)
        console.log(tab,"Found tile at:",found)

        module.exports.setPriceOfTile(accountindex,mainLand[0],mainLand[1],found,price)
      });
    });
  },
  buildTileOnFirstTileOfTypes:(accountindex,oldtiletypeArray,newtiletype)=>{
    describe('#buildTileOnFirstTileOfType()', function() {
      it('should buildTile type '+newtiletype+' OnFirstTileOfTypes '+JSON.stringify(oldtiletypeArray), async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();

        //search from middle out for one tile type
        //let found = await searchLandFromCenterOut(mainLand,9,oldtiletype)
        //console.log(tab,"Found tile at:",found)
        //
        //OR search from left to right for any type in oldtiletypeArray
        let found = false
        for(let i=0;i<18;i++){
          const tileType = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],i)
          if(oldtiletypeArray.indexOf(parseInt(tileType))>=0) {
            found=i
            break
          }
        }

        assert(found!=false,"Couldn't find a tile that matches types::",oldtiletypeArray)
        const result = await clevis("contract","buildTile","Land",accountindex,mainLand[0],mainLand[1],found,newtiletype)
        printTxResult(result)
      });
    });
  },
  /*setContractOfFirstTileOfType:(accountindex,tiletype,contract)=>{
    describe('#setContractOfFirstTileOfType()', function() {
      it('should set the contract of the first tile of a specific type', async function() {
        this.timeout(120000)
        let mainLand = await getMainLand();

        let found = await searchLandFromCenterOut(mainLand,9,tiletype)
        console.log(tab,"Found tile at:",found)

        module.exports.setContractOfTile(accountindex,mainLand[0],mainLand[1],found,contract)
      });
    });
  },*/

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
        loadAbi("Experience")
        loadAbi("Bay")
        loadAbi("Sky")
        loadAbi("Harbor")
        loadAbi("Dogger")
        loadAbi("Timber")
        loadAbi("Stone")
        loadAbi("Greens")
        loadAbi("Catfish")
        loadAbi("Pinner")
        loadAbi("Redbass")
        loadAbi("Snark")
        loadAbi("Dangler")
        loadAbi("Copper")
        loadAbi("Fishmonger")
        loadAbi("Fillet")
        loadAbi("LandLib")
        loadAbi("Land")
        loadAbi("Ipfs")
        loadAbi("Village")
        loadAbi("Castle")
        loadAbi("CitizensLib")
        loadAbi("Citizens")
        loadAbi("TimberCamp")
        loadAbi("Market")
      });
    });
  },
  metamask:()=>{
    describe('#transfer() ', function() {
      it('should give metamask account some ether', async function() {
        this.timeout(600000)
        //await clevis("sendTo","0.1","0","0x34aA3F359A9D614239015126635CE7732c18fDF3")
        //await clevis("sendTo","0.1","0","0xB2ac59aE04d0f7310dC3519573BF70387b3b6E3a")
        //await clevis("sendTo","0.1","0","0xfdE139e04963094650bAAD2686ca65A0cF04373C")
        //await clevis("sendTo","0.1","0","0x1D1B2B691Aaf5E5490864ED91c818B200C0fA0E2")
        //await clevis("sendTo","0.1","0","0x9921d057a7931b1ee5040ff82a3722dd3decb6cd")

        await clevis("sendTo","0.1","0","0x2a906694D15Df38F59e76ED3a5735f8AAbccE9cb")
        await clevis("sendTo","0.1","0","0x9319Bbb4e2652411bE15BB74f339b7F6218b2508")
        //await clevis("sendTo","0.1","0","0xE68b423E49e13C704d2E403014a9C90d7961B98c")
        //await clevis("sendTo","0.1","0","0x841b8C25Ce434B9Ca3ff12492a5468321e933A5b")

        //these accounts are loose from ganache -- watch out on public networks!
        //await clevis("sendTo","0.1","0","0x627306090abab3a6e1400e9345bc60c78a8bef57")
        //await clevis("sendTo","0.1","0","0xf17f52151ebef6c7334fad080c5704d77216b732")

        //firefox
        await clevis("sendTo","0.1","0","0x5f19cEfc9C9D1BC63f9e4d4780493ff5577D238B")
        await clevis("sendTo","0.1","0","0xF11b9dCa0972e95b292891b027F5d8102e2cB8a5")

        module.exports.mintTo("Redbass",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",5)
        module.exports.mintTo("Stone",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",50)
        module.exports.mintTo("Timber",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",50)
        module.exports.mintTo("Copper",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",10000)
        module.exports.mintTo("Fillet",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",50)
        module.exports.mintTo("Greens",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",20)
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
        let SeaAddress = await checkContractDeployment("Bay")

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

  //a new method to sandbox deploy to just what you need for testing
  fastdeploy:()=>{
    describe(bigHeader('DEPLOY'), function() {
      it('should deploy', async function() {
        this.timeout(6000000)
        const result = await clevis("test","deploy")
        assert(result==0,"deploy ERRORS")
      });
    });
    describe(bigHeader('BUILD HARBOR AND FISH MONGER'), function() {
      it('should buildHarborAndFishMonger', async function() {
        this.timeout(6000000)
        const result = await clevis("test","buildHarborAndFishMonger")
        assert(result==0,"buildHarborAndFishMonger ERRORS")
      });
    });
    //do an initail publish just to get the browser to reload with the latest
    // describe(bigHeader('PUBLISH'), function() {
    //   it('should publish conract address to app', async function() {
    //     this.timeout(6000000)
    //     const result = await clevis("test","publish")
    //     assert(result==0,"publish ERRORS")
    //   });
    // });
    describe(bigHeader('METAMASK'), function() {
      it('should give metamask users some fake ether', async function() {
        this.timeout(6000000)
        const result = await clevis("test","metamask")
        assert(result==0,"metamask ERRORS")
      });
    });
    describe(bigHeader('MINT FISH AND STOCK'), function() {
      it('should mintCatfishAndStockSea', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintCatfishAndStockSea")
        assert(result==0,"mintCatfishAndStockSea ERRORS")
      });
    });
    describe(bigHeader('MINT Copper AND TEST FISH MONGER'), function() {
      it('should mintCopperTestFishmonger', async function() {
        this.timeout(6000000)
        const result = await clevis("test","mintCopperTestFishmonger")
        assert(result==0,"mintCopperTestFishmonger ERRORS")
      });
    });
    //do a final publish to reload the browser with updates
    // describe(bigHeader('PUBLISH'), function() {
    //   it('should publish conract address to app', async function() {
    //     this.timeout(6000000)
    //     const result = await clevis("test","publish")
    //     assert(result==0,"publish ERRORS")
    //   });
    // });
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
    describe(bigHeader('EMBARK AND GO FISHING'), function() {
      it('should embarkAndGoFishing', async function() {
        this.timeout(6000000)
        const result = await clevis("test","embarkAndGoFishing")
        assert(result==0,"embarkAndGoFishing ERRORS")
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

  },

  redeploy:()=>{
    describe(bigHeader('DEPLOY'), function() {
      it('should deploy', async function() {
        this.timeout(6000000)
        const result = await clevis("test","deploy")
        assert(result==0,"deploy ERRORS")
      });
    });

    describe(bigHeader('BUILD HARBOR AND FISH MONGER'), function() {
      it('should buildHarborAndFishMonger', async function() {
        this.timeout(6000000)
        const result = await clevis("test","buildHarborAndFishMonger")
        assert(result==0,"buildHarborAndFishMonger ERRORS")
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
  },
  full:()=>{
    describe(bigHeader('COMPILE'), function() {
      it('should compile', async function() {
        this.timeout(6000000)
        const result = await clevis("test","compile")
        assert(result==0,"compile ERRORS")
      });
    });

    describe('#redeploy()', function() {
      it('should redeploy', async function() {
        this.timeout(240000)
        module.exports.redeploy()
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

findFirstLandTile = async (mainLand)=>{
  for(let i=0;i<18;i++){
    const tileType = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],i)
    if(tileType!=0) return i;
  }
}

findFirstTileType = async (mainLand,tileType)=>{
  for(let i=0;i<18;i++){
    const tileType = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],i)
    if(tileType!=0) return i;
  }
}

searchLandFromCenterOut = async (mainLand,startingPoint,tileType) =>{
  let bestTile = false;
  let foundTile = false;
  let upCounter = startingPoint
  let downCounter = startingPoint-1
  while(!foundTile){
    const atThisTile = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],upCounter)
    console.log(tab,"Tile at "+upCounter+" is "+atThisTile)
    if(atThisTile==tileType){
      foundTile=true;
      bestTile=upCounter;
    }else{
      upCounter++
      const atThisTile = await clevis("contract","tileTypeAt","Land",mainLand[0],mainLand[1],downCounter)
      console.log(tab,"Tile at "+downCounter+" is "+atThisTile)
      if(atThisTile==tileType){
        foundTile=true;
        bestTile=downCounter;
      }else{
        downCounter--;
      }
    }
  }
  return bestTile;
}

getMainLand = async ()=>{
  const mainX = await clevis("contract","mainX","Land")
  const mainY = await clevis("contract","mainY","Land")
  //console.log(tab,"Main Land: ",mainX,mainY)
  return [mainX,mainY];
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
