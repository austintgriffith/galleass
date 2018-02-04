/*

  https://galleass.io
  by Austin Thomas Griffith

*/

import React, { Component } from 'react';
import Draggable from 'react-draggable';

import './App.css';
import galleassAddress from './Address.js'
import galleassBlockNumber from './blockNumber.js'
import Writing from './Writing.js'
/*
assuming that galleassBlockNumber is the oldest block for all contracts
that means if you redeploy the galleass contract you have to redeploy ALL
of the other ones or rebuild this logic (maybe just always use the original)
this is used for event look back
 */
import galleassAbi from './Galleass.abi.js'
import Blockies from 'react-blockies';
import Fish from './Fish.js'
import Land from './Land.js'
import Ships from './Ships.js'
import Clouds from './Clouds.js'
import Inventory from './Inventory.js'
import Metamask from './Metamask.js'
import {Motion, spring, presets} from 'react-motion';
//var smoothScroll = require('smoothscroll');
//var Scroll  = require('react-scroll');
//var scroll     = Scroll.animateScroll;
//let DragScroll = require("DragScroll");
var Web3 = require('web3');
let width = 4000;
let height = 1050;
let horizon = 300;
let shipSpeed = 512;
let contracts = {};
let blocksLoaded = {};
let txWaitIntervals = [];
let web3;
let veryFirstLoad = true;

let loadContracts = [
  "Sea",
  "Harbor",
  "Dogger",
  "Timber",
  "Catfish",
  "Pinner",
  "Redbass",
  "Snark",
  "Dangler",
  "Fishmonger",
  "Copper",
  "Land"
]

let inventoryTokens = [
  "Dogger",
  "Copper",
  "Timber",
  "Catfish",
  "Pinner",
  "Redbass",
  "Snark",
  "Dangler",
]
const MINGWEI = 0.1
const MAXGWEI = 151
const STARTINGGWEI = 51;
const GAS = 100000;
const FISHINGBOAT = 0;
const LOADERSPEED = 1237 //this * 24 should be close to a long block time
const ETHERPREC = 10000 //decimals to show on eth inv
const EVENTLOADCHUNK = 5760;//load a days worth of blocks of events at a time? (this should probably be more right?)
const FISHEVENTSYNCLIVEINTERVAL = 2357
const SHIPSEVENTSYNCLIVEINTERVAL = 2341
const CLOUDEVENTSYNCLIVEINTERVAL = 7919
let eventLoadIndexes = {};
let bottomBarTimeout;
let textStyle = {
  zIndex:210,
  fontWeight:'bold',
  fontSize:22,
  paddingRight:10,
  color:"#dddddd",
  textShadow: "-1px 0 #777777, 0 1px #777777, 1px 0 #777777, 0 -1px #777777"
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapScale:1,
      GWEI:STARTINGGWEI,
      gweiOpacity:0.3,
      etherscan:"https://etherscan.io/",
      scrollLeft:0,
      scrollConfig:{stiffness: 80, damping: 20},
      inventory:[],
      inventoryDetail:[],
      fish:[],
      ships:[],
      clouds:[],
      blockNumber:0,
      offlineCounter:0,
      avgBlockTime:15000,
      metamaskDip:0,
      buttonBumps:[],
      zoom:"100%",
      bottomBar:-80,
      bottomBarSize:20,
      bottomBarMessage:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:,",
      modalHeight:-600,
      modalObject:{name:"Loading..."},
      mapRightStart:(document.documentElement.clientWidth-300),
      mapBottomStart:(document.documentElement.clientHeight-80),
      mapUp:false,
      mapOverflow:"hidden",
      cornerOpacity:0,
      mapScrollConfig:{stiffness: 96, damping: 14},
      titleRightStart:20,
      titleBottomStart:12,
      titleScrollConfig:{stiffness: 60, damping: 14},
      mapIconConfig:{stiffness: 60, damping: 10},
      clickScreenWidth:document.documentElement.clientWidth,
      clickScreenHeight:document.documentElement.clientHeight,
      clickScreenTop:0,
      clickScreenOpacity:1,
      clickScreenConfig:{stiffness:8, damping: 20},
    }

    setTimeout(()=>{
      this.setState({clickScreenOpacity:0.1})
    },1000)

    this.state.titleRight = this.state.titleRightStart;
    this.state.titleBottom = this.state.titleBottomStart;
    this.state.titleBottomFaster = this.state.titleBottomStart;


    this.state.mapRight = this.state.mapRightStart;
    this.state.mapBottom = this.state.mapBottomStart;

    setInterval(this.syncBlockNumber.bind(this),887)
    try{
      web3 = new Web3(window.web3.currentProvider)
      if(DEBUGCONTRACTLOAD) console.log("galleassAddress",galleassAddress)
      contracts["Galleass"] = new web3.eth.Contract(galleassAbi,galleassAddress)
      for(let c in loadContracts){
        loadContract(loadContracts[c])
      }
      waitInterval = setInterval(waitForAllContracts.bind(this),229)

    } catch(e) {
      console.log(e)
    }

  }

  setEtherscan(url){
    this.setState({etherscan:url})
  }
  init(account) {
    console.log("Init "+account+"...")
    this.setState({account:account})
    this.setState({bottomBar:0,bottomBarMessage:"Stage 1: Use a #Dogger  Dogger to catch #Fish  Fish then sell them for #Copper  Copper.",bottomBarSize:23})
    clearTimeout(bottomBarTimeout)
    bottomBarTimeout = setTimeout(()=>{
      this.setState({bottomBar:-80})
    },30000)
  }

  async sync(name,doSyncFn,CRAWLBACKDELAY,SYNCINVERVAL) {
    if(typeof eventLoadIndexes["sync"+name+"Down"] == "undefined"){
      eventLoadIndexes["sync"+name+"Down"] = this.state.blockNumber;
    }
    if(typeof eventLoadIndexes["sync"+name+"Live"] == "undefined"){
      eventLoadIndexes["sync"+name+"Live"] = this.state.blockNumber-1;
      setInterval(()=>{
        doSyncFn(eventLoadIndexes["sync"+name+"Live"],'latest')
        eventLoadIndexes["syncFishLive"]= this.state.blockNumber-1;
      },SYNCINVERVAL)
    }
    let nextChunk = eventLoadIndexes["sync"+name+"Down"]-EVENTLOADCHUNK;
    if(nextChunk<=galleassBlockNumber) nextChunk=galleassBlockNumber;
    await doSyncFn(nextChunk,eventLoadIndexes["sync"+name+"Down"])
    eventLoadIndexes["sync"+name+"Down"]=nextChunk;
    if(nextChunk>galleassBlockNumber) setTimeout(this.sync.bind(this,name,doSyncFn,CRAWLBACKDELAY,SYNCINVERVAL),CRAWLBACKDELAY)
  }
  async doSyncFish(from,to) {
    let DEBUG_SYNCFISH = false
    let storedFish = []
    if(from<1) from=1
    if(DEBUG_SYNCFISH) console.log("Sync Fish Chunk: "+from+" to "+to)
    let catchEvent = await contracts["Sea"].getPastEvents('Catch', {
        fromBlock: from-1,
        toBlock: to
    })
    if(DEBUG_SYNCFISH) console.log("catch...",catchEvent)
    for(let f in catchEvent){
      let id = catchEvent[f].returnValues.id
      let species = catchEvent[f].returnValues.species
      let timestamp = catchEvent[f].returnValues.timestamp
      if(!storedFish[id] || storedFish[id].timestamp < timestamp){
        if(DEBUG_SYNCFISH) console.log("&&&& CAAAATTTCH!!!",id)
        storedFish[id]={timestamp:timestamp,species:species,dead:true};
      }
    }
    if(DEBUG_SYNCFISH) console.log("Sync Fish Chunk: "+from+" to "+to)
    let fish = await contracts["Sea"].getPastEvents('Fish', {
        fromBlock: from-1,
        toBlock: to
    })
    if(DEBUG_SYNCFISH) console.log("fish...",fish)
    for(let f in fish){
      let id = fish[f].returnValues.id
      let species = fish[f].returnValues.species
      let timestamp = fish[f].returnValues.timestamp
      let image = fish[f].returnValues.image
      if(!storedFish[id] || storedFish[id].timestamp < timestamp){
        if(DEBUG_SYNCFISH) console.log(id)
        let result = await contracts["Sea"].methods.fishLocation(id).call()
        storedFish[id]={timestamp:timestamp,species:species,x:result[0],y:result[1],dead:false,image:web3.utils.hexToUtf8(image)};
      }
    }
    if(hasElements(storedFish)){
      storedFish = mergeByTimestamp(storedFish,this.state.fish)
      if(DEBUG_SYNCFISH) console.log("SETSTATE storedFish",storedFish)
      this.setState({fish:storedFish})
    }
  }
  async doSyncShips(from,to) {
    let DEBUG_SYNCSHIPS = false;
    if(DEBUG_SYNCSHIPS) console.log("Sync ships")
    if(from<1) from=1
    let ships = await contracts["Sea"].getPastEvents('ShipUpdate', {
        fromBlock: from,
        toBlock: to
    })
    if(DEBUG_SYNCSHIPS) console.log("ship...",ships)
    let storedShips = [];
    let updated = false;
    for(let b in ships){
      let id = ships[b].returnValues.owner.toLowerCase()
      let timestamp = ships[b].returnValues.timestamp
      if(!storedShips[id]||storedShips[id].timestamp < timestamp){
        if(DEBUG_SYNCSHIPS) console.log(ships[b].returnValues)
        storedShips[id]={
          timestamp:timestamp,
          id:ships[b].returnValues.id,
          floating:ships[b].returnValues.floating,
          sailing:ships[b].returnValues.sailing,
          direction:ships[b].returnValues.direction,
          fishing:ships[b].returnValues.fishing,
          blockNumber:ships[b].returnValues.blockNumber,
          location:ships[b].returnValues.location
        };
      }
    }
    if(hasElements(storedShips)){
      storedShips = mergeByTimestamp(storedShips,this.state.ships)
      if(DEBUG_SYNCSHIPS) console.log("SETSTATE storedShips",storedShips)
        this.setState({ships:storedShips})
    }
  }
  async doSyncClouds(from,to) {
    const DEBUG_SYNCCLOUDS = false;
    let storedClouds = []
    if(from<1) from=1
    let clouds = await contracts["Sea"].getPastEvents('Cloud', {fromBlock: from,toBlock: to})
    for(let c in clouds){
      if(!storedClouds[clouds[c].transactionHash]){
        storedClouds[clouds[c].transactionHash] = clouds[c].returnValues
      }
    }
    if(hasElements(storedClouds)){
      storedClouds = mergeByTimestamp(storedClouds,this.state.clouds)
      if(DEBUG_SYNCCLOUDS) console.log("SETSTATE storedClouds",storedClouds)
          this.setState({clouds:storedClouds})
    }
  }
  async syncInventory() {
    const DEBUG_INVENTORY = false;
    if(this.state && this.state.account && this.state.inventory){

      let inventory = this.state.inventory
      let inventoryDetail = this.state.inventoryDetail
      let update = false
      let updateDetail = false
      if(DEBUG_INVENTORY) console.log("account",this.state.account)

      if(inventory['Dogger']>0){
        let myShipArray = await contracts["Dogger"].methods.tokensOfOwner(this.state.account).call()
        if(myShipArray && !isEquivalentAndNotEmpty(myShipArray,inventoryDetail['Dogger'])){
          inventoryDetail['Dogger']=myShipArray
          updateDetail=true
        }
      }

      for(let i in inventoryTokens){
          if(DEBUG_INVENTORY) console.log(contracts[inventoryTokens[i]])
          let balanceOf = await contracts[inventoryTokens[i]].methods.balanceOf(this.state.account).call()
          if(DEBUG_INVENTORY) console.log("balanceOf",inventoryTokens[i],balanceOf)
          if(inventory[inventoryTokens[i]]!=balanceOf){
            inventory[inventoryTokens[i]] = balanceOf;
            update=true
          }
      }

      let balanceOfEther = Math.round(web3.utils.fromWei(await web3.eth.getBalance(this.state.account),"Ether")*ETHERPREC)/ETHERPREC;
      if(DEBUG_INVENTORY) console.log("balanceOfEther",balanceOfEther)
      if(inventory['Ether']!=balanceOfEther){
        inventory['Ether']=balanceOfEther
        update=true
      }

      if(update){
        //console.log("INVENTORY UPDATE....")
        this.setState({loading:0,inventory:inventory,waitingForInventoryUpdate:false})
      }
      if(updateDetail){
        //.log("DETAIL INVENTORY UPDATE....")
        this.setState({loading:0,inventoryDetail:inventoryDetail,waitingForInventoryUpdate:false})
      }
    }
  }
  async syncMyShip() {
    const DEBUG_SYNCMYSHIP = false;
    if(DEBUG_SYNCMYSHIP) console.log("SYNCING MY SHIP")
    let myship = this.state.ship;
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    if(DEBUG_SYNCMYSHIP) console.log("Getting ship for account "+accounts[0])
    let getMyShip = await contracts["Sea"].methods.getShip(accounts[0]).call();
    if(DEBUG_SYNCMYSHIP) console.log("COMPARE",this.state.ship,getMyShip)
    let zoom = 150
    //if(JSON.stringify(this.state.ship)!=JSON.stringify(getMyShip)) {
    if(this.state.ship) getMyShip.inRangeToDisembark = this.state.ship.inRangeToDisembark
    let shipHasNotUpdated = isEquivalentAndNotEmpty(this.state.ship,getMyShip)
    if(getMyShip && !shipHasNotUpdated){

      let zoomPercent = 1/(parseInt(this.state.zoom)/100)
      /////console.log("zoomPercent",zoomPercent)
      if(DEBUG_SYNCMYSHIP) console.log("UPDATE MY SHIP",JSON.stringify(this.state.ship),JSON.stringify(getMyShip))
      let myLocation = 2000;
      if(getMyShip.floating){
        //console.log("======MY myLocation",getMyShip.location)
        myLocation = 4000 * getMyShip.location / 65535
        if(DEBUG_SYNCMYSHIP) console.log("myLocation",myLocation)
        //console.log("scrolling with zoom ",this.state.zoom)
        let windowWidthWithZoom = (document.documentElement.clientWidth) * zoomPercent
        if(veryFirstLoad){
          veryFirstLoad=false;
          setTimeout(()=>{
            this.setState({scrollLeft:myLocation-windowWidthWithZoom/2})
          },3000)//delay so when it scrolls to the middle first it will scroll here next
        }else{
          this.setState({scrollLeft:myLocation-windowWidthWithZoom/2})
        }

      }
      //console.log("SHIP UPDATE ",getMyShip)
      try{
        getMyShip.inRangeToDisembark = await contracts["Sea"].methods.inRangeToDisembark(accounts[0]).call();
        //console.log("getMyShip.inRangeToDisembark",getMyShip.inRangeToDisembark)
      }catch(e){console.log("ERROR checking inRangeToDisembark",e)}
      this.setState({zoom:"100%",loading:0,ship:getMyShip,waitingForShipUpdate:false,myLocation:myLocation},()=>{
        //if(DEBUG_SYNCMYSHIP)
        //console.log("SET getMyShip",this.state.ship)
      })
    }
  }
  async syncLand() {
    const DEBUG_SYNCLAND = false;
    if(DEBUG_SYNCLAND) console.log("SYNCING LAND")
    if(!this.state.landX || !this.state.landY){
      let mainX = await contracts["Land"].methods.mainX().call();
      let mainY = await contracts["Land"].methods.mainY().call();
      this.setState({landX:mainX,landY:mainY},()=>{
        console.log("Reloading with Land x,y",mainX,mainY)
        this.syncLand()
      })
    }else{
      let land = this.state.land;
      if(!land) land=[]
      for(let l=0;l<18;l++){
        let currentTileHere = await contracts["Land"].methods.tileTypeAt(this.state.landX,this.state.landY,l).call();
        land[l]=currentTileHere
      }
      if(land!=this.state.land){
        console.log("LAND UPDATE",land)
        this.setState({land:land})
      }
      console.log("Loading Harbor Location",this.state.landX,this.state.landY,contracts["Harbor"]._address)
      let harborLocation = await contracts["Land"].methods.getTileLocation(this.state.landX,this.state.landY,contracts["Harbor"]._address).call();
      if(harborLocation!=this.state.harborLocation){
        this.setState({harborLocation:parseInt(harborLocation),scrollLeft:parseInt(harborLocation)-(document.documentElement.clientWidth/2)})
      }
    }
  }
  async syncBlockNumber(){
    //console.log("checking block number....")
    if( !web3 || !web3.eth || typeof web3.eth.getBlockNumber !="function" || !this.state.contractsLoaded){
      let offlineCounter = this.state.offlineCounter;
      offlineCounter+=1;
      if(offlineCounter<3){
        this.setState({offlineCounter:offlineCounter})
      }else{
        let blockNumber = this.state.blockNumber;
        blockNumber+=1

        let thisBlockTime = Date.now()-this.state.lastBlockWasAt
        if(!thisBlockTime) thisBlockTime=1000
        let avgBlockTime = this.state.avgBlockTime*4/5+thisBlockTime/5

        console.log("BLOCKNUMBER:",blockNumber,"blockTime",thisBlockTime,"avgBlockTime",avgBlockTime)

        this.setState({offlineCounter:0,avgBlockTime:avgBlockTime,lastBlockWasAt:Date.now(),blockNumber:blockNumber})
      }

    }else{
      try{
        let blockNumber = await web3.eth.getBlockNumber();
        if(this.state.blockNumber!=blockNumber){

          let thisBlockTime = Date.now()-this.state.lastBlockWasAt
          if(!thisBlockTime) thisBlockTime=20000
          let avgBlockTime = this.state.avgBlockTime*4/5+thisBlockTime/5

          console.log("BLOCKNUMBER:",blockNumber,"blockTime",thisBlockTime,"avgBlockTime",avgBlockTime)

          this.setState({avgBlockTime:avgBlockTime,lastBlockWasAt:Date.now(),blockNumber:blockNumber})
        }
      }catch(e){
        console.log(e)
      }

    }

  }

  async buyShip() {
    console.log("BUYSHIP")
    this.bumpButton("buyship")
    if(!web3){
      //hint to install metamask
      this.metamaskHint()
    }else{
      try{
        const accounts = await promisify(cb => web3.eth.getAccounts(cb));
        console.log(accounts)
        if(!accounts[0]){
          this.metamaskHint()
        }else{
          let currentPrice = await contracts["Harbor"].methods.currentPrice(web3.utils.fromAscii("Dogger")).call()
          console.log("current price for",FISHINGBOAT,"is",currentPrice)
          contracts["Harbor"].methods.buyShip(web3.utils.fromAscii("Dogger")).send({
            value: currentPrice,
            from: accounts[0],
            gas:90000,
            gasPrice:this.state.GWEI * 1000000000
          },(error,hash)=>{
            console.log("CALLBACK!",error,hash)
            this.setState({currentTx:hash});
            if(!error) this.load()
            this.resetButton("buyship")
          }).on('error',this.handleError.bind(this)).then((receipt)=>{
            console.log("RESULT:",receipt)
            this.startWaiting(receipt.transactionHash,"inventoryUpdate")
          })
        }

      }catch(e){
        console.log(e)
        this.metamaskHint()
      }
    }
  }
  async disembark() {
    console.log("disembark")
    this.bumpButton("disembark")

    const accounts = await promisify(cb => web3.eth.getAccounts(cb));

    contracts["Sea"].methods.disembark(this.state.ships[this.state.account].id).send({
      from: accounts[0],
      gas:200000,
      gasPrice:this.state.GWEI * 1000000000
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.setState({currentTx:hash});
      if(!error) this.load()
      this.resetButton("disembark")
    }).on('error',this.handleError.bind(this)).then((receipt)=>{
      console.log("RESULT:",receipt)
      this.startWaiting(receipt.transactionHash)
    })
  }
  async embark() {
    console.log("embark")
    this.bumpButton("approveandembark")

    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    //console.log(accounts)
    //console.log("methods.embark(",this.state.inventoryDetail['Ships'][0])
    contracts["Sea"].methods.embark(this.state.inventoryDetail['Dogger'][0]).send({
      from: accounts[0],
      gas:250000,
      gasPrice:this.state.GWEI * 1000000000
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.setState({currentTx:hash});
      if(!error) this.load()
      this.resetButton("approveandembark")
    }).on('error',this.handleError.bind(this)).then((receipt)=>{
      console.log("RESULT:",receipt)
      this.startWaiting(receipt.transactionHash)
    })
  }
  async sellFish(fish){
    console.log("SELL FISH "+fish)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    let fishContract = contracts[fish];
    console.log("fishContractAddress:",fishContract._address)
    let paying = await contracts["Fishmonger"].methods.price(fishContract._address).call()
    console.log("Fishmonger is paying ",paying," for ",fishContract._address)
    contracts["Fishmonger"].methods.sellFish(fishContract._address,1).send({
      from: accounts[0],
      gas:210000,
      gasPrice:this.state.GWEI * 1000000000
    },/*(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.setState({currentTx:hash});
      if(!error) this.load()
    }*/).on('error',this.handleError.bind(this)).then((receipt)=>{
      console.log("RESULT:",receipt)
      this.startWaiting(receipt.transactionHash)
    })
  }
  setSail(direction){
    console.log("SET SAIL")
    if(direction) this.bumpButton("saileast")
    else this.bumpButton("sailwest")
    window.web3.eth.getAccounts((err,_accounts)=>{
      console.log(_accounts)
      contracts["Sea"].methods.setSail(direction).send({
        from: _accounts[0],
        gas:40000,
        gasPrice:this.state.GWEI * 1000000000
      },(error,hash)=>{
        console.log("CALLBACK!",error,hash)
        this.setState({currentTx:hash});
        if(!error) this.load()
        if(direction) this.resetButton("saileast")
        else this.resetButton("sailwest")
      }).on('error',this.handleError.bind(this)).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  dropAnchor(){
    console.log("DROP ANCHOR")
    this.bumpButton("dropanchor")
    window.web3.eth.getAccounts((err,_accounts)=>{
      console.log(_accounts)
      contracts["Sea"].methods.dropAnchor().send({
        from: _accounts[0],
        gas:40000,
        gasPrice:this.state.GWEI * 1000000000
      },(error,hash)=>{
        console.log("CALLBACK!",error,hash)
        this.setState({currentTx:hash});
        if(!error) this.load()
        this.resetButton("dropanchor")
      }).on('error',this.handleError.bind(this)).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  castLine(){
    console.log("CAST LINE")
    this.bumpButton("castline")
    window.web3.eth.getAccounts((err,_accounts)=>{
      let bait = web3.utils.sha3(Math.random()+_accounts[0])
      console.log(bait)
      let baitHash = web3.utils.sha3(bait)
      this.setState({bait:bait,baitHash:baitHash})
      contracts["Sea"].methods.castLine(baitHash).send({
        from: _accounts[0],
        gas:60000,
        gasPrice:this.state.GWEI * 1000000000
      },(error,hash)=>{
        console.log("CALLBACK!",error,hash)
        this.setState({currentTx:hash});
        if(!error) this.load()
        this.resetButton("castline")
      }).on('error',this.handleError.bind(this))
      .on('transactionHash', function(transactionHash){
        console.log("transactionHash",transactionHash)
      })
      .on('receipt', function(receipt){
         console.log("receipt",receipt) // contains the new contract address
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log("confirmation",confirmationNumber,receipt)
      })
      .then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  reelIn(){
    console.log("REEL IN")
    this.bumpButton("reelin")

    const DEBUG_REEL_IN = false;
    window.web3.eth.getAccounts((err,_accounts)=>{
      //console.log(_accounts)

      let bestDist = width*width
      let bestId = false
      let myShip = this.state.ships[this.state.account];

      for(let f in this.state.fish){
        if(DEBUG_REEL_IN) console.log("f",f)
        if(this.state.fish[f].dead){
          //console.log("DEAD FISH IGNORE ",f)
        }else{
          let a = parseInt(this.state.fish[f].x)
          let b = parseInt(myShip.location)
          if(DEBUG_REEL_IN) console.log(a,b)
          let x = myShip.location-this.state.fish[f].x
          let y = 0-this.state.fish[f].y
          if(DEBUG_REEL_IN) console.log(x,y)
          let diff = Math.sqrt(x*x + (y*y/90));
          if(DEBUG_REEL_IN) console.log("DIFF TO ",f,"IS",diff)
          if(DEBUG_REEL_IN) console.log(f,diff)
          //console.log("this.state.fish.x",this.state.fish[f].x,"myShip.location",myShip.location,diff)
          if( diff < bestDist ){

            bestDist=diff
            bestId=f
            //if(DEBUG_REEL_IN)
            console.log("========== found closer ",bestDist,bestId)
          }
        }
      }
      //console.log(myShip)
      if(DEBUG_REEL_IN) console.log("BAIT",this.state.bait)
      if(DEBUG_REEL_IN) console.log("BESTS",bestDist,bestId)

      let baitToUse = this.state.bait
      if(!baitToUse||baitToUse=="false") baitToUse="0x0000000000000000000000000000000000000000";
      if(!bestId||bestId=="false") bestId="0x0000000000000000000000000000000000000000";

      if(DEBUG_REEL_IN) console.log("FINAL ID BAIT & ACCOUNT",bestId,baitToUse,_accounts[0])

      contracts["Sea"].methods.reelIn(bestId,baitToUse).send({
        from: _accounts[0],
        gas:100000,
        gasPrice:this.state.GWEI * 1000000000
      },(error,hash)=>{
        console.log("CALLBACK!",error,hash)
        this.setState({currentTx:hash});
        if(!error) this.load()
        this.resetButton("reelin")
      }).on('error',this.handleError.bind(this)).then((receipt)=>{
        if(DEBUG_REEL_IN) console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }

  metamaskHint(){
    this.setState({metamaskDip:20},()=>{
      setTimeout(()=>{
        this.setState({metamaskDip:0})
      },550)
    })
  }
  handleError(error){
    console.log("HANDLETHIS:",error)
    if(error.toString().indexOf("Error: Transaction was not mined")>=0){
      this.setState({loading:0,waitingForTransaction:false})
      clearInterval(txWaitIntervals["loader"])
      clearInterval(txWaitIntervals[this.state.currentTx])
      this.setState({bottomBar:0,bottomBarMessage:"Warning: your transaction might not get mined, try increasing your #gas  gas price.",bottomBarSize:20})
      clearTimeout(bottomBarTimeout)
      bottomBarTimeout = setTimeout(()=>{
        this.setState({bottomBar:-80})
      },10000)
    }
  }

  updateLoader(){
    let next = parseInt(this.state.loading)+1;
    if(next>24) {
      next=23;
    }else{
      //console.log("loading next",next,web3)
      this.setState({loading:next})
    }
  }
  async startWaitingForTransaction(hash){

    this.setState({loading:0})
    clearInterval(txWaitIntervals["loader"])

    console.log("WAITING FOR TRANSACTION ",hash,this.state.waitingForTransaction,this.state.waitingForTransactionTime)
    try {
        var receipt = await web3.eth.getTransactionReceipt(this.state.waitingForTransaction);
        console.log("TIME SPENT:"+Date.now()-this.state.waitingForTransactionTime)
        if (receipt == null) {
          //keep waiting

        } else {
          //DONE
          //DONE
          console.log("DONE WITH TX",receipt)
          clearInterval(txWaitIntervals[hash])
          txWaitIntervals[hash]=null
          clearInterval(txWaitIntervals["loader"])
          if(receipt.status=="0x0"){
            //this.state.waitingForTransaction || this.state.waitingForShipUpdate || this.state.waitingForInventoryUpdate
            this.setState({loading:0,waitingForTransaction:false,waitingForShipUpdate:false,waitingForInventoryUpdate:false})
            this.setState({bottomBar:0,bottomBarMessage:"Warning: Transaction failed. Try again with a higher #gas  gas price.",bottomBarSize:24})
            clearTimeout(bottomBarTimeout)
            bottomBarTimeout = setTimeout(()=>{
              this.setState({bottomBar:-80})
            },10000)
          }else{
            this.setState({waitingForTransaction:false})
            ////do this to skip green loader (don't)
            //this.setState({loading:0,waitingForTransaction:false,waitingForShipUpdate:false,waitingForInventoryUpdate:false})
            console.log("CALL A SYNC OF EVERYTHING!!")
            this.syncEverythingOnce()
          }

        }
    } catch(e) {
        console.log("ERROR WAITING FOR TX",e)
        clearInterval(txWaitIntervals[hash]);
        this.setState({loading:0,waitingForTransaction:false})
    }
    console.log("DONE WAITING ON TRANSACTION")
  }
  bumpButton(name){
    let currentBumps = this.state.buttonBumps
    if(!currentBumps[name]) currentBumps[name]= 15
    else currentBumps[name]+= 15
    this.setState({currentBumps:currentBumps})
  }
  resetButton(name){
    let currentBumps = this.state.buttonBumps
    currentBumps[name]=0
    this.setState({currentBumps:currentBumps})
  }

  load(){
    console.log("LOAD!")
    this.setState({loading:1},()=>{
      txWaitIntervals["loader"] = setInterval(this.updateLoader.bind(this),LOADERSPEED)
    })
  }
  startWaiting(hash,nextPhase){
    if(hash){
      console.log("STARTWAITING",hash,nextPhase)
      let update = {waitingForTransaction:hash,waitingForTransactionTime:Date.now()}
      if(nextPhase=="inventoryUpdate"){
        update.waitingForInventoryUpdate=true
      }else{
        update.waitingForShipUpdate=true
      }
      this.setState(update,()=>{
        txWaitIntervals[hash] = setInterval(this.startWaitingForTransaction.bind(this,hash),1200)
        this.startWaitingForTransaction(hash)
        setTimeout(()=>{
          console.log("CHECKING BACK ON TX ",hash,txWaitIntervals[hash])
          if(txWaitIntervals[hash]){
            clearInterval(txWaitIntervals[hash]);
            this.setState({loading:0,waitingForTransaction:false})
            clearInterval(txWaitIntervals["loader"])
            this.setState({bottomBar:0,bottomBarMessage:"Warning: Your transaction is taking a long time, try increasing your #gas  gas price.",bottomBarSize:20})
            clearTimeout(bottomBarTimeout)
            bottomBarTimeout = setTimeout(()=>{
              this.setState({bottomBar:-80})
            },10000)
          }

        },this.state.avgBlockTime*2)
      })
    }
  }
  startEventSync() {
    console.log("Finished loading contracts and block number, start syncing events...",this.state.blockNumber)
    clearInterval(waitInterval);
    this.setState({avgBlockTime:15000,contractsLoaded:true,clickScreenTop:-90000,clickScreenOpacity:0})
    //dev loop only...
    //setInterval(this.syncContacts.bind(this),4001)
    //this.syncContacts()
    /*setTimeout(
      ()=>{
        this.setState({scrollConfig: {stiffness: 2, damping: 20}})
      },3000
    )*/
    setInterval(this.syncMyShip.bind(this),1381)
    setInterval(this.syncInventory.bind(this),2273)
    setInterval(this.syncLand.bind(this),30103)
    this.sync("Fish",this.doSyncFish.bind(this),127,FISHEVENTSYNCLIVEINTERVAL);
    this.sync("Ships",this.doSyncShips.bind(this),198,SHIPSEVENTSYNCLIVEINTERVAL);
    this.sync("Clouds",this.doSyncClouds.bind(this),151,CLOUDEVENTSYNCLIVEINTERVAL);
    this.syncEverythingOnce()
  }
  syncEverythingOnce() {
    this.syncBlockNumber()
    this.syncMyShip()
    this.syncInventory()
    this.syncLand()
    this.doSyncFish(this.state.blockNumber-2,'latest')
    this.doSyncShips(this.state.blockNumber-2,'latest')
    this.doSyncClouds(this.state.blockNumber-2,'latest')
  }
  bumpableButton(name,buttonsTop,fn){
    let buttonBounce = parseInt(this.state.buttonBumps[name])
    if(!buttonBounce) buttonBounce = 0
    //console.log("buttonBounce",buttonBounce)
    return (
      <Motion key={"Button"+name}
        defaultStyle={{
          top:buttonsTop
        }}
        style={{
          top:spring(buttonsTop+buttonBounce,{stiffness: 150, damping: 5})// presets.noWobble)
        }}
      >
      {fn}
      </Motion>
    )
  }
  titleClick(){
    console.log("Clicked Title")
    if(this.state.mapUp){
      this.setState({
        mapUp:false,
        mapOverflow:"scroll",

        cornerOpacity:0,
        mapRight:this.state.mapRightStart,
        mapBottom:this.state.mapBottomStart,
        titleRight:this.state.titleRightStart,
        titleBottom:this.state.titleBottomStart,
        titleBottomFaster:this.state.titleBottomStart,
        bottomBar:-80,
      })
    }else{
      this.setState({
        mapUp:true,
        mapOverflow:"hidden",
        cornerOpacity:1,
        mapRight:0,
        mapBottom:0,
        titleRight:document.documentElement.clientWidth/2-140,
        titleBottom:document.documentElement.clientHeight-68,
        titleBottomFaster:document.documentElement.clientHeight-68,
        bottomBar:0,
        bottomBarMessage:"Here be monsters on the blockchain...",
        bottomBarSize:24
      })
    }
  }
  async tileClick(name,index,px) {
    console.log("TILE CLICK",name,index,px)
    let tile = await contracts['Land'].methods.getTile(this.state.landX,this.state.landY,index).call();
    let modalObject = {
      name:name,
      contract:tile._contract,
      owner:tile._owner,
      price:tile._price,
      index:index,
      px:px
    }
    console.log("modalObject",modalObject)
    this.setState({
      modalObject:modalObject,
      modalHeight:180,
      clickScreenTop:0,
      clickScreenOpacity:0.5
    })
  }
  clickScreenClick(){
    if(this.state.modalHeight>=0){
      //click screen is up for modal
      this.setState({modalHeight:-600,clickScreenTop:-5000,clickScreenOpacity:0})
    }else{
      this.metamaskHint()
    }
  }
  handleWhiskeyStart(){
    this.setState({gweiOpacity:0.8})
  }
  handleWhiskeyStop(){
    this.setState({gweiOpacity:0.3})
  }
  handleWhiskeyDrag(mouse,obj){
    let currentPercent = obj.x + (STARTINGGWEI/MAXGWEI*100);
    let actualGWEI = Math.round(currentPercent/100 * MAXGWEI,1);
    if(actualGWEI<MINGWEI) actualGWEI=MINGWEI;
    if(actualGWEI>MAXGWEI) actualGWEI=MAXGWEI;
    this.setState({GWEI:actualGWEI})
  }
  mapWheel(obj,b,c){
    if(this.state.mapUp){
      let scaleTo=1.0;
      if(obj.deltaY>0){
        scaleTo = Math.round((this.state.mapScale+0.05)*100)/100
      }else{
        scaleTo = Math.round((this.state.mapScale-0.05)*100)/100
      }
      console.log("SCALE TO",scaleTo)
      this.setState({mapScale:scaleTo})
      obj.stopPropagation()
      obj.preventDefault()
    }
  }
  render() {
    let buttons = [];
    if(!this.state){
      return (
        <div key={"LOADING"}>Loading</div>
      )
    }

    let myShip
    if(this.state/*&&this.state.shipsOfOwner*/){
      myShip = this.state.ship;
    }
    //console.log("myShip",myShip)

    //both of these are in sync and we need to test which is fastest
    // one is all of the ship events while the other is doing a get ship
    //let myShip = this.state.ship;
    //console.log(myShip)
    //myShip = this.state.ships[this.state.account];
    //console.log("console.log(myShip)",myShip)

    //if(myShip) console.log("myShip FISHING:",myShip.fishing)
    //if(this.state.ship) console.log("FISHING this.state.ship:",this.state.ship.fishing,)

    //console.log("ACCOUNT",this.state.account)
    //console.log("SHIPS:",this.state.ships)
    let buttonsTop = horizon-290;
    let buttonsLeft = -1000;
    let loadingBar = ""

    if(this.state.harborLocation>0){
      buttonsLeft = this.state.harborLocation
    }else{
      buttonsLeft=-1000;
    }

    if(myShip&&myShip.floating&&myShip.location){
      buttonsLeft = this.state.myLocation
    }
    if(!buttonsLeft) buttonsLeft=-2000

    let buttonOpacity = 0.9
    let buttonDisabled = false
    if(this.state.loading){
      buttonOpacity = 0.5
      buttonDisabled = true
      loadingBar = (
        <a href={this.state.etherscan+"tx/"+this.state.currentTx} target='_blank'><img src={"preloader_"+this.state.loading+".png"} /></a>
      )
    } else if( this.state.waitingForTransaction || this.state.waitingForShipUpdate || this.state.waitingForInventoryUpdate){
      buttonOpacity = 0.3
      buttonDisabled = true
      let timeSpentWaiting = Date.now() - this.state.waitingForTransactionTime
      timeSpentWaiting = Math.floor(timeSpentWaiting/1200)+1;
      //console.log("timeSpentWaiting",timeSpentWaiting)
      if(timeSpentWaiting>12) timeSpentWaiting=12
      loadingBar = (
        <a href={this.state.etherscan+"tx/"+this.state.currentTx} target='_blank'><img src={"loader_"+timeSpentWaiting+".png"} /></a>
      )
    }

    if(!myShip||!myShip.floating){
      if(!this.state||!this.state.contractsLoaded){
        //wait for contracts to load but for now let's preload some stuff off screen
        buttons.push(
          <div style={{position:'absolute',left:10,top:10}}>


          </div>
        )
      }else if(this.state.inventoryDetail && (!this.state.inventoryDetail['Dogger']||this.state.inventoryDetail['Dogger'].length<=0) && this.state.inventory['Dogger']<=0){
        let clickFn = this.buyShip.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        buttons.push(
          this.bumpableButton("buyship",buttonsTop,(animated) => {
            if(animated.top>50) animated.top=50
              let extraWidth = animated.top - buttonsTop
              let theLeft = this.state.harborLocation-75+((extraWidth)/2)
              if(!theLeft){
                return (<div></div>)
              }else{
                return (
                  <div key={"buyship"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:theLeft,top:animated.top,opacity:buttonOpacity}} onClick={clickFn}>
                    <img src="buyship.png" style={{maxWidth:150-(extraWidth)}}/>
                  </div>
                )
              }
            }
          )
        )
      }else if(this.state.inventory['Dogger']>0){
        let clickFn = this.embark.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        if(this.state.inventoryDetail['Dogger'] && this.state.inventoryDetail['Dogger'].length>0){
          buttons.push(
            this.bumpableButton("approveandembark",buttonsTop,(animated) => {
              if(animated.top>50) animated.top=50
              let extraWidth = animated.top - buttonsTop
                return (
                  <div key={"approveAndEmbark"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:buttonsLeft-75+((extraWidth)/2),top:animated.top,opacity:buttonOpacity}} onClick={clickFn}>
                    <img src="approveAndEmbark.png" style={{maxWidth:150-(extraWidth)}}/>
                  </div>
                )
              }
            )
          )
        }else{
          console.log("WAITING FOR INV DETAIL....")
          buttons.push(
            <div>
            </div>
          )
        }
      }else{
        let clickFn = this.metamaskHint.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        buttons.push(
          this.bumpableButton("buyshipHolder",buttonsTop,(animated) => {
            if(animated.top>50) animated.top=50
              let extraWidth = animated.top - buttonsTop
              let theLeft = this.state.harborLocation-75+((extraWidth)/2);
              if(!theLeft){
                return (<div></div>)
              }else{
                return (
                  <div key={"buyshipHolder"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:theLeft,top:animated.top,opacity:buttonOpacity}} onClick={clickFn}>
                    <img src="buyship.png" style={{maxWidth:150-(extraWidth)}}/>
                  </div>
                )
              }

            }
          )
        )
      }

    /*}else if(!myShip.floating){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft,top:buttonsTop,opacity:buttonOpacity}} onClick={this.embark.bind(this)}>
          <img src="gofishing.png" style={{maxWidth:150}}/>
        </div>
      )*/
    }else if(myShip.sailing){
      let clickFn = this.dropAnchor.bind(this)
      if(buttonDisabled){clickFn=()=>{}}
      buttons.push(
        this.bumpableButton("dropanchor",buttonsTop,(animated) => {
          if(animated.top>50) animated.top=50
          let extraWidth = animated.top - buttonsTop
            return (
              <div key={"dropanchor"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:buttonsLeft-75+((extraWidth)/2),top:animated.top,opacity:buttonOpacity}} onClick={clickFn}>
                <img src="dropanchor.png" style={{maxWidth:150-(extraWidth)}}/>
              </div>
            )
          }
        )
      )
    }else if(myShip.fishing){
      let clickFn = this.reelIn.bind(this);
      if(buttonDisabled){clickFn=()=>{}}
      let buttonBounce = parseInt(this.state.buttonBumps['reelin'])
      if(!buttonBounce) buttonBounce = 0
      //console.log("buttonBounce",buttonBounce)
      buttons.push(
        this.bumpableButton("reelin",buttonsTop,(animated) => {
          if(animated.top>50) animated.top=50
          let extraWidth = animated.top - buttonsTop
            return (
              <div key={"reelin"} style={{cursor:"pointer",zIndex:200,position:'absolute',top:animated.top,left:buttonsLeft-75+((extraWidth)/2),opacity:buttonOpacity}} onClick={clickFn}>
                  <img src="reelin.png" style={{maxWidth:150-(extraWidth)}}/>
              </div>
            )
          }
        )
      )
    }else{
      let clickFn1 = this.setSail.bind(this,true)
      if(buttonDisabled){clickFn1=()=>{}}
      buttons.push(
        this.bumpableButton("saileast",buttonsTop,(animated) => {
          if(animated.top>50) animated.top=50
          let extraWidth = animated.top - buttonsTop
            return (
              <div key={"saileast"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:buttonsLeft+180-75+((extraWidth)/2),top:animated.top,opacity:buttonOpacity}} onClick={clickFn1}>
                <img src="saileast.png" style={{maxWidth:150-(extraWidth)}}/>
              </div>
            )
          }
        )
      )
      let clickFn2 = this.castLine.bind(this,true)
      if(buttonDisabled){clickFn2=()=>{}}
      buttons.push(
        this.bumpableButton("castline",buttonsTop,(animated) => {
          if(animated.top>50) animated.top=50
          let extraWidth = animated.top - buttonsTop
            return (
              <div key={"castLine"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:buttonsLeft-75+((extraWidth)/2),top:animated.top,opacity:buttonOpacity}} onClick={clickFn2}>
                <img src="castLine.png" style={{maxWidth:150-(extraWidth)}}/>
              </div>
            )
          }
        )

      )
      let clickFn3 = this.setSail.bind(this,false)
      if(buttonDisabled){clickFn3=()=>{}}
      buttons.push(
        this.bumpableButton("sailwest",buttonsTop,(animated) => {
          if(animated.top>50) animated.top=50
          let extraWidth = animated.top - buttonsTop
            return (
              <div key={"sailwest"} style={{cursor:"pointer",zIndex:200,position:'absolute',left:buttonsLeft-180-75+((extraWidth)/2),top:animated.top,opacity:buttonOpacity}} onClick={clickFn3}>
                <img src="sailwest.png" style={{maxWidth:150-(extraWidth)}}/>
              </div>
            )
          }
        )
      )
      let clickFn = this.disembark.bind(this)
      buttons.push(
        this.bumpableButton("disembark",buttonsTop,(animated) => {
            if(animated.top>50) animated.top=50
            let extraWidth = animated.top - buttonsTop
            let theLeft = this.state.harborLocation-(75/2)+((extraWidth)/2)
            let theOpacity = buttonOpacity
            if(!this.state.ship.inRangeToDisembark){
              theOpacity=0.25
              clickFn=()=>{
                this.setState({bottomBar:0,bottomBarMessage:"You must be closer to the harbor to disembark.",bottomBarSize:28})
                clearTimeout(bottomBarTimeout)
                bottomBarTimeout = setTimeout(()=>{
                  this.setState({bottomBar:-80})
                },10000)
              }
            }
            if(!theLeft){
              return (<div></div>)
            }else{
              return (
                <div key={"disembark"} style={{cursor:"pointer",zIndex:199,position:'absolute',left:theLeft,top:animated.top+150,opacity:theOpacity}} onClick={clickFn}>
                  <img src="disembark.png" style={{maxWidth:75-(extraWidth)}}/>
                </div>
              )
            }
          }
        )
      )
    }
    buttons.push(
      <div style={{zIndex:201,position:'absolute',left:buttonsLeft-50,top:buttonsTop+50,opacity:0.7}}>
        {loadingBar}
      </div>
    )


    let menuSize = 60;
    let menu = (
      <div key={"MENU"} style={{position:"fixed",left:0,top:0,width:"100%",height:menuSize,overflow:'hidden',borderBottom:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <Motion
          defaultStyle={{
            marginRight:0
          }}
          style={{
            marginRight: spring(this.state.metamaskDip,{stiffness: 80, damping: 7})// presets.noWobble)
          }}
        >
          {currentStyles => {
            return (
              <div style={currentStyles}>
                <Metamask
                  textStyle={textStyle}
                  account={this.state.account}
                  init={this.init.bind(this)}
                  Blockies={Blockies}
                  blockNumber={this.state.blockNumber}
                  etherscan={this.state.etherscan}
                  setEtherscan={this.setEtherscan.bind(this)}
                  lastBlockWasAt={this.state.lastBlockWasAt}
                  avgBlockTime={this.state.avgBlockTime}
                />
              </div>
            )
          }}
        </Motion>


      </div>
    )
    let inventory = (
      <div style={{position:"fixed",right:0,top:75,width:200,border:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <Inventory
          inventory={this.state.inventory}
          Ships={this.state.Ships}
          textStyle={textStyle}
          sellFish={this.sellFish}
          contracts={contracts}
          etherscan={this.state.etherscan}
        />
      </div>
    )
    let sea = (
      <div style={{position:"absolute",left:0,top:0,width:width,height:height,overflow:'hidden'}} >
        <div style={{position:'absolute',left:0,top:0,opacity:1,backgroundImage:"url('sky.jpg')",backgroundRepeat:'no-repeat',height:horizon,width:width}}></div>
        <Clouds web3={web3} clouds={this.state.clouds} horizon={horizon} width={width} blockNumber={this.state.blockNumber}/>
        <div style={{position:'absolute',left:0,top:horizon,opacity:1,backgroundImage:"url('oceanblackblur.jpg')",backgroundRepeat:'no-repeat',height:height+horizon,width:width}}></div>
        {buttons}
        <Ships
          ships={this.state.ships}
          width={width}
          height={height}
          horizon={horizon+100}
          Blockies={Blockies}
          web3={web3}
          shipSpeed={shipSpeed}
          blockNumber={this.state.blockNumber}
          etherscan={this.state.etherscan}
        />
        <Fish web3={web3} fish={this.state.fish} width={width} height={height} horizon={horizon+150} />
      </div>
    )
    //  <div style={{zIndex:11,position:'absolute',left:0,top:horizon,opacity:.7,backgroundImage:"url('oceanfront.png')",backgroundRepeat:'no-repeat',height:height+horizon,width:width}}></div>

    let land = (
      <div style={{position:"absolute",left:0,top:horizon-60,width:width}} >
        <Land land={this.state.land} Blockies={Blockies} tileClick={this.tileClick.bind(this)}/>
      </div>
    )

    if(!this.state.contractsLoaded) buttons="";

    let galley= (
      <div key={"galley"} style={{
        zIndex:20,
        position:'absolute',
        left:3500,
        top:500,
        opacity:0.9,
        height:75,
        width:140
      }}>
      <img src={"galley.png"} />
      <div style={{
        position:'absolute',
        top:24,
        left:21
      }}>
      <Blockies
        seed={"galley"}
        scale={2.3}
      />
      </div>
      </div>
    )

    let clickScreen = (
      <Motion
        defaultStyle={{
          opacity:1
        }}
        style={{
          opacity:spring(this.state.clickScreenOpacity,this.state.clickScreenConfig)
        }}
      >
        {currentStyles => {
          return (
            <div style={{width:this.state.clickScreenWidth,height:this.state.clickScreenHeight,opacity:currentStyles.opacity,backgroundColor:"#000000",position:"fixed",left:0,top:this.state.clickScreenTop,zIndex:899}} onClick={this.clickScreenClick.bind(this)}>
            </div>
          )
        }}
      </Motion>
    )

    ///if(this.state.contractsLoaded) clickScreenWhenNotLoggedIn=""

    //right:window.innerWidth,bottom:window.innerHeight
    //width:window.innerWidth,height:window.innerHeight
    //console.log(this.state.titleRightStart)
    return (
      <div className="App" style={{zoom:this.state.zoom}}>

        {clickScreen}
        {menu}
        {inventory}
        {sea}
        {land}
        {galley}
        <Motion
          defaultStyle={{
            right:this.state.mapRightStart,
            bottom:this.state.mapBottomStart,
            titleRight:this.state.titleRightStart,
            titleBottom:this.state.titleBottomStart,
            titleBottomFaster:this.state.titleBottomStart,
            overflow:"hidden",
          }}
          style={{
            right:spring(this.state.mapRight,this.state.mapScrollConfig),
            bottom:spring(this.state.mapBottom,this.state.mapScrollConfig),
            titleRight:spring(this.state.titleRight,this.state.titleScrollConfig),
            titleBottom:spring(this.state.titleBottom,this.state.titleScrollConfig),
            titleBottomFaster:spring(this.state.titleBottom,this.state.mapIconConfig),
            overflow:this.state.mapOverflow,
          }}
        >
          {currentStyles => {
          //  console.log(this.state.land)
            let currentTotal = 0
            let islands = []
            for(let i in this.state.land){
              if(this.state.land[i]==0){
                if(currentTotal>0){
                  islands.push(currentTotal)
                  currentTotal=0
                }else{
                  currentTotal=0
                }
              }else{
                currentTotal++
              }
            }
            if(currentTotal>0){
              islands.push(currentTotal)
            }
            //console.log("islands",islands)
            let offset = 0
            let islandRender = islands.map((island)=>{
              offset+=30
              //console.log(island,"@",offset)
              return (
                <div key={"island0part"+offset} style={{position:'absolute',left:700+offset,top:500}}>
                  <img style={{maxWidth:70}} src={"island"+island+".png"} />
                </div>
              )
            })

            //add in some filler islands for now
            /// the land is generated, it's just hard to display so far
            let fakelocationx
            let fakelocationy
            offset = 0
            fakelocationx = 800
            fakelocationy = 600
            let island2 = []
            offset+=30
            island2.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island3.png"} />
              </div>
            )
            offset+=30
            island2.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island7.png"} />
              </div>
            )
            offset+=30
            island2.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island2.png"} />
              </div>
            )

            offset = 0
            fakelocationx = 180
            fakelocationy = 450
            let island3 = []
            offset+=30
            island3.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island3.png"} />
              </div>
            )
            offset+=30
            island3.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island11.png"} />
              </div>
            )
            offset+=30
            island3.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island6.png"} />
              </div>
            )

            offset = 0
            fakelocationx = 754
            fakelocationy = 234
            let island4 = []
            offset+=30
            island4.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island14.png"} />
              </div>
            )
            offset+=30
            island4.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island2.png"} />
              </div>
            )
            offset+=30
            island4.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island1.png"} />
              </div>
            )
            offset+=30
            island4.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island8.png"} />
              </div>
            )

            offset = 0
            fakelocationx = 312
            fakelocationy = 321
            let island5 = []
            offset+=30
            island5.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island16.png"} />
              </div>
            )
            offset+=30
            island5.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island2.png"} />
              </div>
            )
            offset+=30
            island5.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island13.png"} />
              </div>
            )
            offset+=30
            island5.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island8.png"} />
              </div>
            )
            offset+=30
            island5.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island8.png"} />
              </div>
            )

            offset = 0
            fakelocationx = 140
            fakelocationy = 280
            let island6 = []
            offset+=30
            island6.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island1.png"} />
              </div>
            )
            offset+=30
            island6.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island4.png"} />
              </div>
            )
            offset+=30
            island6.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island2.png"} />
              </div>
            )
            offset+=30
            island6.push(
              <div style={{position:'absolute',left:fakelocationx+offset,top:fakelocationy}}>
                <img style={{maxWidth:70}} src={"island3.png"} />
              </div>
            )



            let startingPercent = STARTINGGWEI / MAXGWEI
            let startingPixels = startingPercent*100
            let rightSideRoom = 100-startingPixels
            let gasOffset = 16;
            let gasDragger = (
              <div>

                <div style={{position:'absolute',left:182+gasOffset,top:105,opacity:this.state.gweiOpacity*2/3}}>
                  <Writing string={"cheap"} size={12}/>
                </div>
                <div style={{position:'absolute',left:212+gasOffset,top:110,opacity:this.state.gweiOpacity}}>
                  <Writing string={this.state.GWEI+" gwei"} size={16}/>
                </div>
                <div style={{position:'absolute',left:270+gasOffset,top:105,opacity:this.state.gweiOpacity*2/3}}>
                  <Writing string={"fast"} size={12}/>
                </div>
                <div style={{
                  width:100,
                  height:9,
                  backgroundImage:"url('gasbar.png')",
                  position:"absolute",left:190+gasOffset,top:92,opacity:this.state.gweiOpacity*1.6
                }}></div>
                <Draggable axis="x" bounds={{left:startingPixels*-1,right:rightSideRoom}}
                  onDrag={this.handleWhiskeyDrag.bind(this)}
                  onStart={this.handleWhiskeyStart.bind(this)}
                  onStop={this.handleWhiskeyStop.bind(this)}
                >
                  <div style={{
                    width:25,
                    height:35,
                    backgroundImage:"url('whiskeystrength.png')",
                    position:"absolute",left:177+startingPixels+gasOffset,top:77
                  }}></div>
                </Draggable>
              </div>
            )

            return (

              <div style={{
                position:'fixed',
                right:currentStyles.right,
                bottom:currentStyles.bottom,
                width:document.documentElement.clientWidth,
                height:document.documentElement.clientHeight,
                zIndex:300,
                overflow:currentStyles.overflow,
              }}>

                    <div style={{
                      width:6500,
                      height:6500,
                    }} onWheel = {this.mapWheel.bind(this)}>
                    <div style={{
                      width:6500,
                      height:6500,
                      /*transform:"scale("+this.state.mapScale+")",*/
                    }}>
                      <Draggable bounds={{right:300,left:-6200,bottom:100,top:-6400}}>

                        <div style={{
                          width:6500,
                          height:6500,
                          position:'relative',
                          left:-300,
                          top:-100,
                          backgroundImage:"url('maptexturelightfaded.jpg')",
                        }}>
                          //real island
                          {islandRender}
                          //fake, filler island for now to get the look right
                          {island2}
                          {island3}
                          {island4}
                          {island5}
                          {island6}
                        </div>

                      </Draggable>
                      </div>
                      <div style={{cursor:"pointer",zIndex:2,marginBottom:-20,marginRight:-10,position:'absolute',right:currentStyles.titleRight,bottom:currentStyles.titleBottom}} onClick={this.titleClick.bind(this)}>
                        <Writing string={"Galleass.io"} size={60} space={5} letterSpacing={29}/>
                      </div>
                      <div style={{position:'absolute',left:0,top:0}}>
                        <img style={{maxWidth:(document.documentElement.clientWidth/5)}} src={"topleftcorner.png"} />
                      </div>
                      <div style={{position:'absolute',right:0,top:0}}>
                        <img style={{maxWidth:(document.documentElement.clientWidth/5)}} src={"toprightcorner.png"} />
                      </div>
                      <div style={{position:'absolute',opacity:this.state.cornerOpacity,right:0,bottom:-4}} onClick={this.titleClick.bind(this)}>
                        <img src={"corner.png"} />
                      </div>
                      <div style={{cursor:"pointer",zIndex:1,position:'fixed',opacity:1-this.state.cornerOpacity,top:currentStyles.titleBottomFaster-20,left:-20}} >
                        <a href="https://github.com/austintgriffith/galleass" target="_blank"><img style={{maxHeight:36,position:"absolute",left:25,top:83,opacity:0.8}} src="github.png" /></a>
                        <a href="http://austingriffith.com/portfolio/galleass/" target="_blank"><img style={{maxHeight:36,position:"absolute",left:70,top:83,opacity:0.8}} src="moreinfo.png" /></a>
                        <a href="http://ipfs.io/ipfs/QmUBZj3DY6u4qNjxXa7dYoQjMSNvMAMM4vVCWYSupsLLHE" target="_blank"><img style={{maxHeight:36,position:"absolute",left:115,top:83,opacity:0.8}} src="ipfs.png" /></a>
                        {gasDragger}
                        <img src={"mapicon.png"} onClick={this.titleClick.bind(this)}/>
                      </div>
                      <div style={{position:'absolute',opacity:this.state.cornerOpacity,left:10,bottom:10}} onClick={this.titleClick.bind(this)}>
                        <img src={"compass.png"} style={{maxWidth:60}} />
                      </div>
                    </div>

              </div>

            )

          }}
        </Motion>

        <Motion
          defaultStyle={{
            scrollLeft:document.scrollingElement.scrollLeft
          }}
          style={{
            zoom:this.state.zoom,
            scrollLeft: spring(this.state.scrollLeft,this.state.scrollConfig )// presets.noWobble)
          }}
        >
          {currentStyles => {
            //console.log("currentStyles.scrollLeft",currentStyles.scrollLeft)
            return <WindowScrollSink scrollLeft={currentStyles.scrollLeft} />

          }}
        </Motion>

        <Motion
          defaultStyle={{
            bottom:-100
          }}
          style={{
            bottom:spring(this.state.bottomBar,{ stiffness: 100, damping: 7 })
          }}
        >
          {currentStyles => {
            //console.log("currentStyles.scrollLeft",currentStyles.scrollLeft)
            return (
              <div style={{zIndex:400,position:'fixed',left:document.documentElement.clientWidth/2-400,paddingTop:30,textAlign:"center",bottom:currentStyles.bottom,opacity:1,backgroundImage:"url('bottomBar.png')",backgroundRepeat:'no-repeat',height:50,width:800}}>
                <Writing style={{opacity:0.9}} string={this.state.bottomBarMessage} size={this.state.bottomBarSize}/>
              </div>
            )

          }}
        </Motion>

        <Motion
          defaultStyle={{
            top:-500
          }}
          style={{
            top:spring(this.state.modalHeight,{ stiffness: 100, damping: 10 })
          }}
        >
          {currentStyles => {
            let image = this.state.modalObject.name.toLowerCase()+".png"
            if(this.state.modalObject.name.indexOf("Resource")>=0){
              image = this.state.modalObject.name.split("Resource").join("");
              image = image.split(" ").join("");
              image = image+"tile.png"
            }else if(this.state.modalObject.name.indexOf("Stream")>=0){
              image = "blank_stream.png"
            }else if(this.state.modalObject.name.indexOf("Grass")>=0){
              image = "blank_hills.png"
            }else if(this.state.modalObject.name.indexOf("Hills")>=0){
              image = "blank_grass.png"
            }

            return (
              <div style={{zIndex:999,position:'fixed',left:document.documentElement.clientWidth/2-350,paddingTop:30,top:currentStyles.top,textAlign:"center",opacity:1,backgroundImage:"url('modal.png')",backgroundRepeat:'no-repeat',height:500,width:700}}>
                <div style={{position:'absolute',right:24,top:24}} onClick={this.clickScreenClick.bind(this)}>
                  <img src="exit.png" />
                </div>
                <div style={{position:'absolute',left:24,top:24,border:"3px solid #777777"}}>
                  <img style={{maxWidth:83}} src={image}/>
                </div>
                <div style={{position:'absolute',left:118,top:24,textAlign:"left"}}>
                  <div><Writing style={{opacity:0.9}} string={this.state.modalObject.name} size={28}/>  -  {this.state.modalObject.index} @ ({this.state.landX},{this.state.landY})</div>
                  <div>Contract: {this.state.modalObject.contract}</div>
                  <div>Owner: {this.state.modalObject.owner}</div>
                  <div>Price: {this.state.modalObject.price}</div>
                </div>
              </div>
            )

          }}
        </Motion>





      </div>
    );
  }
}

const DEBUGCONTRACTLOAD = false;
let loadContract = async (contract)=>{
  try{
    if(DEBUGCONTRACTLOAD) console.log("HITTING GALLEASS for address of "+contract)
    if(DEBUGCONTRACTLOAD) console.log(contracts["Galleass"])
    let hexContractName = web3.utils.asciiToHex(contract);
    if(DEBUGCONTRACTLOAD) console.log(hexContractName)
    let thisContractAddress = await contracts["Galleass"].methods.getContract(hexContractName).call()
    thisContractAddress = thisContractAddress.toLowerCase() //this is needed for metamask to get events !?!
    console.log("CONTRACT",contract,thisContractAddress)
    if(DEBUGCONTRACTLOAD) console.log("ADDRESS:",thisContractAddress)
    let thisContractAbi = require('./'+contract+'.abi.js');
    if(DEBUGCONTRACTLOAD) console.log("LOADING",contract,thisContractAddress,thisContractAbi)
    contracts[contract] = new web3.eth.Contract(thisContractAbi,thisContractAddress)
  } catch(e) {
    console.log("ERROR LOADING "+contract,e)
  }

}

let waitInterval
function waitForAllContracts(){
  const CONTRACTLOADDEBUG = false;
  if(CONTRACTLOADDEBUG) console.log("waitForAllContracts")
  let finishedLoading = true;
  for(let c in loadContracts){
    if(!contracts[loadContracts[c]]) {
      finishedLoading=false;
      if(CONTRACTLOADDEBUG) console.log(loadContracts[c]+" is still loadin")
    }
  }
  if(finishedLoading&&this.state&&this.state.blockNumber) {
    this.startEventSync();
  }
}

function mergeByTimestamp(a,b) {
  for(let i in a) {
    if(a[i]&&b[i]&& a[i].timestamp && b[i].timestamp){
      if(a[i].timestamp>b[i].timestamp){
        b[i] = a[i];
      }else{
        a[i] = b[i];
      }
    }else{
      b[i] = a[i];
    }
  }
  return b;
}

function hasElements(a){
  for(let i in a) {
    return true;
  }
  return false;
}

function isEquivalentAndNotEmpty(a, b) {
    if((!a||!b)&&(a||b)) {
      //console.log("something is blank")
      return false;
    }
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      //console.log("prop length is a different ")
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
          //  console.log("prop"+propName+" changed")
            return false;
        }
    }
    return true;
}

class WindowScrollSink extends Component {
  componentDidUpdate (prevProps) {
    if (prevProps.scrollLeft !== this.props.scrollLeft) {
      document.scrollingElement.scrollLeft = this.props.scrollLeft
    }
  }
  render () {
    return null
  }
}

var toUtf8 = function(hex) {
    var buf = new Buffer(hex.replace('0x',''),'hex');
    return buf.toString();
}

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  );

export default App;
