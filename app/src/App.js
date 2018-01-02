import React, { Component } from 'react';
import './App.css';
import galleassAddress from './Address.js'
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
var Web3 = require('web3');
let width = 4000;
let height = 1050;
let horizon = 300;
let shipSpeed = 1000;
let contracts = {};
let txWaitIntervals = [];
let web3;



let loadContracts = [
  "Sea",
  "Harbor",
  "Ships",
  "Timber",
  "Catfish"
]

const GWEI = 4;
const GAS = 100000;
const FISHINGBOAT = 0;


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
      scrollLeft:2000-(window.innerWidth/2),
      scrollConfig:{stiffness: 80, damping: 20},
      inventory:[],
      inventoryDetail:[],
      fish:[],
      ships:[],
      clouds:[],
      blockNumber:0,
      metamaskDip:0,
      readyToEmbark:false,
    }

    try{
      web3 = new Web3(window.web3.currentProvider)
      if(DEBUGCONTRACTLOAD) console.log("galleassAddress",galleassAddress)
      contracts["Galleass"] = new web3.eth.Contract(galleassAbi,galleassAddress)

      for(let c in loadContracts){
        loadContract(loadContracts[c])
      }
      waitInterval = setInterval(waitForAllContracts.bind(this),1000)
    } catch(e) {
      console.log(e)
    }

  }
  init(account) {
    console.log("Init "+account+"...")
    this.setState({account:account,scrollLeft:2000-(window.innerWidth/2)})
  }
  async syncBlockNumber(){
    console.log("checking block number....")
    let blockNumber = await web3.eth.getBlockNumber();
    if(this.state.blockNumber!=blockNumber){
      console.log("BLOCKNUMBER:",blockNumber)
      this.setState({blockNumber:blockNumber})
    }
  }
  async syncClouds() {
    let clouds = await contracts["Sea"].getPastEvents('Cloud', {fromBlock: 0,toBlock: 'latest'})
    let storedClouds = this.state.clouds;
    let updates = false;
    for(let c in clouds){
      if(!storedClouds[clouds[c].transactionHash]){
        storedClouds[clouds[c].transactionHash] = clouds[c].returnValues
        updates=true;
      }
    }
    this.setState({clouds:storedClouds})
  }
/*  async syncContacts() {
}*/
  async syncInventory() {
    const DEBUG_INVENTORY = false;
    if(this.state && this.state.account && this.state.inventory){

      let inventory = this.state.inventory
      let inventoryDetail = this.state.inventoryDetail
      let update = false
      let updateDetail = false
      if(DEBUG_INVENTORY) console.log("account",this.state.account)

      if(DEBUG_INVENTORY) console.log(contracts["Ships"])
      let balanceOfShips = await contracts["Ships"].methods.balanceOf(this.state.account).call()
      if(DEBUG_INVENTORY) console.log("balanceOfShips",balanceOfShips)
      if(inventory['Ships']!=balanceOfShips){
        inventory['Ships'] = balanceOfShips;
        update=true;
      }

      if(inventory['Ships']>0){
        let myShipArray = await contracts["Ships"].methods.shipsOfOwner(this.state.account).call()
        if(myShipArray && !isEquivalent(myShipArray,inventoryDetail['Ships'])){
          inventoryDetail['Ships']=myShipArray
          updateDetail=true

        }
      }

      if(DEBUG_INVENTORY) console.log(contracts["Catfish"])
      let balanceOfCatfish = await contracts["Catfish"].methods.balanceOf(this.state.account).call()
      if(DEBUG_INVENTORY) console.log("balanceOf",balanceOfCatfish)
      if(inventory['Catfish']!=balanceOfCatfish){
        inventory['Catfish'] = balanceOfCatfish;
        update=true
      }

      let balanceOfEther = Math.round(web3.utils.fromWei(await web3.eth.getBalance(this.state.account),"Ether")*1000)/1000;
      if(DEBUG_INVENTORY) console.log("balanceOfEther",balanceOfEther)
      if(inventory['Ether']!=balanceOfEther){
        inventory['Ether']=balanceOfEther
        update=true
      }


      if(update){
        console.log("INVENTORY UPDATE....")
        this.setState({inventory:inventory,waitingForInventoryUpdate:false})
      }
      if(updateDetail){
        console.log("DETAIL INVENTORY UPDATE....")
        this.setState({inventoryDetail:inventoryDetail,waitingForInventoryUpdate:false})
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
    //if(JSON.stringify(this.state.ship)!=JSON.stringify(getMyShip)) {
    if(getMyShip && !isEquivalent(this.state.ship,getMyShip)){
      if(DEBUG_SYNCMYSHIP) console.log("UPDATE MY SHIP",JSON.stringify(this.state.ship),JSON.stringify(getMyShip))
      let myLocation = 2000;
      if(getMyShip.floating){
        myLocation = 4000 * getMyShip.location / 65535
        if(DEBUG_SYNCMYSHIP) console.log("myLocation",myLocation)
        this.setState({scrollLeft:myLocation-(window.innerWidth/2)})
      }
      this.setState({ship:getMyShip,waitingForShipUpdate:false,myLocation:myLocation},()=>{
        //if(DEBUG_SYNCMYSHIP)
        //console.log("SET getMyShip",this.state.ship)
      })
    }

  }
  async syncShips() {
    /*
    event ShipUpdate(uint256 id,address owner,uint timestamp,bool floating,bool sailing,bool direction,bool fishing,uint32 blockNumber,uint16 location);
    */
    let DEBUG_SYNCSHIPS = false;
    if(DEBUG_SYNCSHIPS) console.log("Sync ships")
    //this wont scale
    //you'll need to work through the chain
    // in chunks and then stay up to date
    let ships = await contracts["Sea"].getPastEvents('ShipUpdate', {
        fromBlock: 0,
        toBlock: 'latest'
    })
    if(DEBUG_SYNCSHIPS) console.log("ship...",ships)
    let storedShips = this.state.ships;
    let updated = false;
    for(let b in ships){
      let id = ships[b].returnValues.owner.toLowerCase()
      //let id = ships[b].returnValues.id
      let timestamp = ships[b].returnValues.timestamp
      if(!storedShips[id]||storedShips[id].timestamp < timestamp){
        if(DEBUG_SYNCSHIPS) console.log(ships[b].returnValues)
        updated=true;
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
    if(updated){
      if(DEBUG_SYNCSHIPS) console.log(storedShips)
      this.setState({ships:storedShips})
    }
  }
  async syncFish() {
    let DEBUG_SYNCFISH = false;
    //if(DEBUG_SYNCFISH) console.log("Sync Fish")
    //this wont scale
    //you'll need to work through the chain
    // in chunks and then stay up to date
    //

    let storedFish = this.state.fish;

    let catchEvent = await contracts["Sea"].getPastEvents('Catch', {
        fromBlock: 0,
        toBlock: 'latest'
    })
    if(DEBUG_SYNCFISH) console.log("catchEvent",catchEvent)
    for(let f in catchEvent){
      console.log(catchEvent[f])
      let id = catchEvent[f].returnValues.id
      let species = catchEvent[f].returnValues.species
      let timestamp = catchEvent[f].returnValues.timestamp
      if(!storedFish[id] || storedFish[id].timestamp < timestamp){
        if(DEBUG_SYNCFISH) console.log(id)
        storedFish[id]={timestamp:timestamp,species:species,dead:true};
      }
    }

    let fish = await contracts["Sea"].getPastEvents('Fish', {
        fromBlock: 0,
        toBlock: 'latest'
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
        storedFish[id]={timestamp:timestamp,species:species,x:result[0],y:result[1],dead:false,image:web3.utils.hexToAscii(image)};
      }
    }

    if(DEBUG_SYNCFISH) console.log("storedFish",storedFish)
    this.setState({fish:storedFish})
  }
  metamaskHint(){
    this.setState({metamaskDip:8},()=>{
      setTimeout(()=>{
        this.setState({metamaskDip:0})
      },500)
    })
  }
  async buyShip() {
    console.log("BUYSHIP")
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
          let currentPrice = await contracts["Harbor"].methods.currentPrice(FISHINGBOAT).call()
          console.log("current price for",FISHINGBOAT,"is",currentPrice)
          contracts["Harbor"].methods.buyShip(FISHINGBOAT).send({
            value: currentPrice,
            from: accounts[0],
            gas:GAS,
            gasPrice:GWEI * 1000000000
          }).then((receipt)=>{
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
  async approveAndEmbark() {
    //"contract","approve",contract,accountindex,toContractAddress,tokens[0]
    console.log("approveAndEmbark")
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    console.log(accounts)
    let seaContractAddress = await contracts["Galleass"].methods.getContract(web3.utils.asciiToHex("Sea")).call()
    console.log("seaContractAddress",seaContractAddress)
    console.log("MY FIRST SHIP ",this.state.inventoryDetail['Ships'][0])
    contracts["Ships"].methods.approve(seaContractAddress,this.state.inventoryDetail['Ships'][0]).send({
      from: accounts[0],
      gas:GAS,
      gasPrice:GWEI * 1000000000
    }).then((receipt)=>{
      console.log("RESULT:",receipt)
      //let result = await clevis("contract","embark","Sea",accountindex,tokens[0])
      contracts["Sea"].methods.embark(this.state.inventoryDetail['Ships'][0]).send({
        from: accounts[0],
        gas:300000,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })

  }
  async approve() {
    console.log("approve")
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    console.log(accounts)
    let seaContractAddress = await contracts["Galleass"].methods.getContract(web3.utils.asciiToHex("Sea")).call()
    console.log("seaContractAddress",seaContractAddress)
    console.log("MY FIRST SHIP ",this.state.inventoryDetail['Ships'][0])
    console.log("methods.approve(",seaContractAddress,this.state.inventoryDetail['Ships'][0])
    contracts["Ships"].methods.approve(seaContractAddress,this.state.inventoryDetail['Ships'][0]).send({
      from: accounts[0],
      gas:50000,
      gasPrice:GWEI * 1000000000
    }).then((receipt)=>{
      console.log("RESULT:",receipt)
      setTimeout(()=>{
        this.setState({readyToEmbark:true})
      },5000)/////////////////////////////////WHY YOU TIMEOUT BRAH?
    })
  }
  async embark() {
    console.log("embark")
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    console.log(accounts)
    console.log("methods.embark(",this.state.inventoryDetail['Ships'][0])
    contracts["Sea"].methods.embark(this.state.inventoryDetail['Ships'][0]).send({
      from: accounts[0],
      gas:200000,
      gasPrice:GWEI * 1000000000
    }).then((receipt)=>{
      console.log("RESULT:",receipt)
      this.startWaiting(receipt.transactionHash)
    })
  }
  async startWaitingForTransaction(hash){
    console.log("WAITING FOR TRANSACTION ",hash,this.state.waitingForTransaction,this.state.waitingForTransactionTime)
    try {
        var receipt = await web3.eth.getTransactionReceipt(this.state.waitingForTransaction);
        if (receipt == null) {
          //keep waiting
          console.log("TIME SPENT:"+Date.now()-this.state.waitingForTransactionTime)
        } else {
          //DONE
          console.log("DONE WITH TX",receipt)
          clearInterval(txWaitIntervals[hash]);
          this.setState({waitingForTransaction:false})
          console.log("CALL A SYNC OF EVERYTHING!!")
          this.syncEverythingOnce()
        }
    } catch(e) {
        console.log("ERROR WAITING FOR TX",e)
        clearInterval(txWaitIntervals[hash]);
        this.setState({waitingForTransaction:false})
    }
    console.log("DONE WAITING ON TRANSACTION")
  }
  /*
  embark(){
    console.log("EMBARK")
    window.web3.eth.getAccounts((err,_accounts)=>{
      console.log(_accounts)
      contracts["Sea"].methods.embark().send({
        from: _accounts[0],
        gas:GAS,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,)
      })
    })
  }
  */
  setSail(direction){
    console.log("SET SAIL")
    window.web3.eth.getAccounts((err,_accounts)=>{
      console.log(_accounts)
      contracts["Sea"].methods.setSail(direction).send({
        from: _accounts[0],
        gas:GAS,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  dropAnchor(){
    console.log("DROP ANCHOR")
    window.web3.eth.getAccounts((err,_accounts)=>{
      console.log(_accounts)
      contracts["Sea"].methods.dropAnchor().send({
        from: _accounts[0],
        gas:GAS,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  castLine(){
    console.log("CAST LINE")
    window.web3.eth.getAccounts((err,_accounts)=>{
      let bait = web3.utils.sha3(Math.random()+_accounts[0])
      console.log(bait)
      let baitHash = web3.utils.sha3(bait)
      this.setState({bait:bait,baitHash:baitHash})
      contracts["Sea"].methods.castLine(baitHash).send({
        from: _accounts[0],
        gas:GAS,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
    })
  }
  reelIn(){
    console.log("REEL IN")
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
          let diff = Math.sqrt(x*x + (y*y/8));
          if(DEBUG_REEL_IN) console.log(diff)
          //console.log("this.state.fish.x",this.state.fish[f].x,"myShip.location",myShip.location,diff)
          if( diff < bestDist ){

            bestDist=diff
            bestId=f
            if(DEBUG_REEL_IN) console.log("found closer ",bestDist,bestId)
          }
        }
      }
      //console.log(myShip)
      if(DEBUG_REEL_IN) console.log("BAIT",this.state.bait)
      if(DEBUG_REEL_IN) console.log("BESTS",bestDist,bestId)

      let baitToUse = this.state.bait
      if(!baitToUse) baitToUse="0x0000000000000000000000000000000000000000";

      if(DEBUG_REEL_IN) console.log("FINAL ID BAIT & ACCOUNT",bestId,baitToUse,_accounts[0])

      contracts["Sea"].methods.reelIn(bestId,baitToUse,).send({
        from: _accounts[0],
        gas:300000,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        if(DEBUG_REEL_IN) console.log("RESULT:",receipt)
        this.startWaiting(receipt.transactionHash,"shipUpdate")
      })
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
      })
    }
  }
  startSync() {
    console.log("Finished Loading")
    clearInterval(waitInterval);
    this.setState({contractsLoaded:true})
    setInterval(this.syncMyShip.bind(this),301)
    setInterval(this.syncBlockNumber.bind(this),503)
    setInterval(this.syncFish.bind(this),3001)
    setInterval(this.syncShips.bind(this),2003)
    setInterval(this.syncInventory.bind(this),1009)
    this.syncEverythingOnce()
    //dev loop only...
    //setInterval(this.syncContacts.bind(this),4001)
    //this.syncContacts()
    /*setTimeout(
      ()=>{
        this.setState({scrollConfig: {stiffness: 2, damping: 20}})
      },3000
    )*/
  }
  syncEverythingOnce() {
    this.syncMyShip()
    this.syncBlockNumber()
    this.syncFish()
    this.syncShips()
    this.syncInventory()
    this.syncClouds()
  }

  render() {
    let buttons = [];
    if(!this.state){
      return (
        <div>Loading</div>
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
    let buttonsTop = horizon-250;
    let buttonsLeft = width/2;
    let loadingBar = ""


    if(myShip&&myShip.floating&&myShip.location){
      buttonsLeft = this.state.myLocation
    }

    let buttonOpacity = 0.9
    let buttonDisabled = false
    if(this.state.waitingForTransaction || this.state.waitingForShipUpdate || this.state.waitingForInventoryUpdate){
      buttonOpacity = 0.3
      buttonDisabled = true
      let timeSpentWaiting = Date.now() - this.state.waitingForTransactionTime
      timeSpentWaiting = Math.floor(timeSpentWaiting/1000)+1;
      console.log("timeSpentWaiting",timeSpentWaiting)
      if(timeSpentWaiting>12) timeSpentWaiting=12
      loadingBar = (
        <img src={"loader_"+timeSpentWaiting+".png"} />
      )
    }

    if(!myShip||!myShip.floating){

      if(this.state.inventoryDetail && (!this.state.inventoryDetail['Ships']||this.state.inventoryDetail['Ships'].length<=0)){
        let clickFn = this.buyShip.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        buttons.push(
          <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn}>
            <img src="buyship.png" style={{maxWidth:150}}/>
          </div>
        )
      }else if(this.state.readyToEmbark){
        let clickFn = this.embark.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        buttons.push(
          <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn}>
            <img src="approveAndEmbark.png" style={{maxWidth:150}}/>
          </div>
        )
      }else{
        let clickFn = this.approve.bind(this)
        if(buttonDisabled){clickFn=()=>{}}
        buttons.push(
          <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn}>
            <img src="approveShipForSea.png" style={{maxWidth:150}}/>
          </div>
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
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn}>
          <img src="dropanchor.png" style={{maxWidth:150}}/>
        </div>
      )
    }else if(myShip.fishing){
      let clickFn = this.reelIn.bind(this);
      if(buttonDisabled){clickFn=()=>{}}
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn}>
          <img src="reelin.png" style={{maxWidth:150}}/>
        </div>
      )
    }else{
      let clickFn1 = this.setSail.bind(this,true)
      if(buttonDisabled){clickFn1=()=>{}}
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft+180-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn1}>
          <img src="saileast.png" style={{maxWidth:150}}/>
        </div>
      )
      let clickFn2 = this.castLine.bind(this,true)
      if(buttonDisabled){clickFn2=()=>{}}
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn2}>
          <img src="castLine.png" style={{maxWidth:150}}/>
        </div>
      )
      let clickFn3 = this.setSail.bind(this,false)
      if(buttonDisabled){clickFn3=()=>{}}
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-180-75,top:buttonsTop,opacity:buttonOpacity}} onClick={clickFn3}>
          <img src="sailwest.png" style={{maxWidth:150}}/>
        </div>
      )
    }
    buttons.push(
      <div style={{zIndex:201,position:'absolute',left:buttonsLeft-50,top:buttonsTop+50,opacity:0.7}}>
        {loadingBar}
      </div>
    )


    let menuSize = 60;
    let menu = (
      <div style={{position:"fixed",left:0,top:0,width:"100%",height:menuSize,overflow:'hidden',borderBottom:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <div style={{float:'left',opacity:0.5}}>
          ...
        </div>

        <Motion
          defaultStyle={{
            marginTop:0
          }}
          style={{
            marginTop: spring(this.state.metamaskDip,{stiffness: 120, damping: 17})// presets.noWobble)
          }}
        >
          {currentStyles => {
            return (
              <div style={currentStyles}>
                <Metamask textStyle={textStyle} account={this.state.account} init={this.init.bind(this)} Blockies={Blockies} blockNumber={this.state.blockNumber}/>
              </div>
            )
          }}
        </Motion>


      </div>
    )
    let inventory = (
      <div style={{position:"fixed",right:5,top:75,width:200,border:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <Inventory
          inventory={this.state.inventory}
          Ships={this.state.Ships}
          textStyle={textStyle}
        />
      </div>
    )
    let sea = (
      <div style={{position:"absolute",left:0,top:0,width:width,height:height,overflow:'hidden'}} >
        <div style={{position:'absolute',left:0,top:0,opacity:1,backgroundImage:"url('sky.jpg')",backgroundRepeat:'no-repeat',height:horizon,width:width}}></div>
        <Clouds clouds={this.state.clouds} horizon={horizon} width={width} blockNumber={this.state.blockNumber}/>
        <div style={{position:'absolute',left:0,top:horizon,opacity:1,backgroundImage:"url('oceanblackblur.jpg')",backgroundRepeat:'no-repeat',height:height+horizon,width:width}}></div>
        {buttons}
        <Ships ships={this.state.ships} width={width} height={height} horizon={horizon+100} Blockies={Blockies} web3={web3} shipSpeed={shipSpeed} blockNumber={this.state.blockNumber}/>
        <Fish fish={this.state.fish} width={width} height={height} horizon={horizon+150} />
        <div style={{zIndex:11,position:'absolute',left:0,top:horizon,opacity:.7,backgroundImage:"url('oceanfront.png')",backgroundRepeat:'no-repeat',height:height+horizon,width:width}}></div>
      </div>
    )

    let land = (
      <div style={{position:"absolute",left:0,top:horizon-60,width:width}} >
        <Land Blockies={Blockies} />
      </div>
    )

    if(!this.state.contractsLoaded) buttons="";



    return (
      <div className="App" >
        {menu}
        {inventory}
        {sea}
        {land}
        <Motion
          defaultStyle={{
            scrollLeft:document.scrollingElement.scrollLeft
          }}
          style={{
            scrollLeft: spring(this.state.scrollLeft,this.state.scrollConfig )// presets.noWobble)
          }}
        >
          {currentStyles => {
            //console.log("currentStyles.scrollLeft",currentStyles.scrollLeft)
            return <WindowScrollSink scrollLeft={currentStyles.scrollLeft} />

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
    if(DEBUGCONTRACTLOAD) console.log("ADDRESS OF SEA:",thisContractAddress)
    let thisContractAbi = require('./'+contract+'.abi.js');
    if(DEBUGCONTRACTLOAD) console.log("LOADING",contract,thisContractAddress,thisContractAbi)
    contracts[contract] = new web3.eth.Contract(thisContractAbi,thisContractAddress)
  } catch(e) {
    console.log(e)
  }

}

let waitInterval
function waitForAllContracts(){
  console.log("waitForAllContracts")
  let finishedLoading = true;
  for(let c in loadContracts){
    if(!contracts[loadContracts[c]]) finishedLoading=false;
  }
  if(finishedLoading) {
    this.startSync();
  }
}

function isEquivalent(a, b) {
    if((!a||!b)&&(a||b)) return false;
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  );

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

export default App;
