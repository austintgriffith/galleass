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
var Web3 = require('web3');
let width = 4000;
let height = 1050;
let horizon = 300;
let shipSpeed = 1000;
let contracts = {};
let txWaitInterval;
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


class App extends Component {
  constructor(props) {
    super(props);
    web3 = new Web3(window.web3.currentProvider)
    if(DEBUGCONTRACTLOAD) console.log("galleassAddress",galleassAddress)
    contracts["Galleass"] = new web3.eth.Contract(galleassAbi,galleassAddress)
    this.state = {inventory:[],inventoryDetail:[],fish:[],ships:[],clouds:[],blockNumber:0};
    for(let c in loadContracts){
      loadContract(loadContracts[c])
    }
    waitInterval = setInterval(waitForAllContracts.bind(this),1000)
  }
  init(account) {
    console.log("Init "+account+"...")
    this.setState({account:account})
    window.scrollTo(2000-(window.innerWidth/2), 0);
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
        if(myShipArray!=inventoryDetail['Ships']){
          inventoryDetail['Ships']=myShipArray
          updateDetail=true;

        }
      }

      if(DEBUG_INVENTORY) console.log(contracts["Catfish"])
      let balanceOfCatfish = await contracts["Catfish"].methods.balanceOf(this.state.account).call()
      if(DEBUG_INVENTORY) console.log("balanceOf",balanceOfCatfish)
      if(inventory['Catfish']!=balanceOfCatfish){
        inventory['Catfish'] = balanceOfCatfish;
        update=true;
      }

      if(update){
        this.setState({inventory:inventory})
      }
      if(updateDetail){
        this.setState({inventoryDetail:inventoryDetail})
      }

    }
  }
  async syncMyShip() {
    let myship = this.state.ship;
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    let getMyShip = await contracts["Sea"].methods.getShip(accounts[0]).call();
    //console.log("COMPARE",this.state.ship,getMyShip)
    if(this.state.ship!=getMyShip) {
      this.setState({ship:getMyShip},()=>{
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
      if(!storedFish[id] || storedFish[id].timestamp < timestamp){
        if(DEBUG_SYNCFISH) console.log(id)
        let result = await contracts["Sea"].methods.fishLocation(id).call()
        storedFish[id]={timestamp:timestamp,species:species,x:result[0],y:result[1],dead:false};
      }
    }

    if(DEBUG_SYNCFISH) console.log("storedFish",storedFish)
    this.setState({fish:storedFish})
  }
  async buyShip() {
    console.log("BUYSHIP")
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    console.log(accounts)
    let currentPrice = await contracts["Harbor"].methods.currentPrice(FISHINGBOAT).call()
    console.log("current price for",FISHINGBOAT,"is",currentPrice)
    contracts["Harbor"].methods.buyShip(FISHINGBOAT).send({
      value: currentPrice,
      from: accounts[0],
      gas:GAS,
      gasPrice:GWEI * 1000000000
    }).then((receipt)=>{
      console.log("RESULT:",receipt)
    })

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
      })
    })

  }
  async startWaitingForTransaction(){
    console.log("WAITING FOR TRANSACTION ",this.state.waitingForTransaction,this.state.waitingForTransactionTime)
    try {
        var receipt = await web3.eth.getTransactionReceipt(this.state.waitingForTransaction);
        if (receipt == null) {
          //keep waiting
          console.log("TIME SPENT:"+Date.now()-this.state.waitingForTransactionTime)
        } else {
          //DONE
          console.log("DONE WITH TX",receipt)
          clearInterval(txWaitInterval);
          this.setState({waitingForTransaction:false})
          this.syncEverythingOnce()
        }
    } catch(e) {
        console.log("ERROR WAITING FOR TX",e)
        clearInterval(txWaitInterval);
        this.setState({waitingForTransaction:false})
    }
  }

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
      })
    })
  }
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
        this.setState({waitingForTransaction:receipt.transactionHash,waitingForTransactionTime:Date.now()},()=>{
          txWaitInterval = setInterval(this.startWaitingForTransaction.bind(this),1000)
        })
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
        this.setState({waitingForTransaction:receipt.transactionHash,waitingForTransactionTime:Date.now()},()=>{
          txWaitInterval = setInterval(this.startWaitingForTransaction.bind(this),1000)
        })
      })
    })
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


    //both of these are in sync and we need to test which is fastest
    // one is all of the ship events while the other is doing a get ship
    let myShip = this.state.ship;
    //console.log(myShip)
    //myShip = this.state.ships[this.state.account];
    //console.log("console.log(myShip)",myShip)

    //if(myShip) console.log("myShip FISHING:",myShip.fishing)
    //if(this.state.ship) console.log("FISHING this.state.ship:",this.state.ship.fishing,)

    //console.log("ACCOUNT",this.state.account)
    //console.log("SHIPS:",this.state.ships)
    let buttonsTop = horizon-250;
    let buttonsLeft = width/2;

    if(myShip&&myShip.floating&&myShip.location){
      let myLocation = 4000 * myShip.location / 65535
      buttonsLeft = myLocation
    }

    let buttonOpacity = 0.9
    if(this.state.waitingForTransaction){
      buttonOpacity=0.3
    }
    //console.log(myShip)

    if(!myShip||!myShip.floating){
      if(!this.state.inventoryDetail['Ships']||this.state.inventoryDetail['Ships'].length<=0){
        buttons.push(
          <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.buyShip.bind(this)}>
            <img src="buyship.png" style={{maxWidth:150}}/>
          </div>
        )
      }else{
        buttons.push(
          <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.approveAndEmbark.bind(this)}>
            <img src="approveAndEmbark.png" style={{maxWidth:150}}/>
          </div>
        )
      }

    }else if(!myShip.floating){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft,top:buttonsTop,opacity:buttonOpacity}} onClick={this.embark.bind(this)}>
          <img src="gofishing.png" style={{maxWidth:150}}/>
        </div>
      )
    }else if(myShip.sailing){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.dropAnchor.bind(this)}>
          <img src="dropanchor.png" style={{maxWidth:150}}/>
        </div>
      )
    }else if(myShip.fishing){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.reelIn.bind(this)}>
          <img src="reelin.png" style={{maxWidth:150}}/>
        </div>
      )
    }else{
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft+180-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.setSail.bind(this,true)}>
          <img src="saileast.png" style={{maxWidth:150}}/>
        </div>
      )
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.castLine.bind(this,false)}>
          <img src="castLine.png" style={{maxWidth:150}}/>
        </div>
      )
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-180-75,top:buttonsTop,opacity:buttonOpacity}} onClick={this.setSail.bind(this,false)}>
          <img src="sailwest.png" style={{maxWidth:150}}/>
        </div>
      )
    }

    let menuSize = 60;
    let menu = (
      <div style={{position:"fixed",left:0,top:0,width:"100%",height:menuSize,overflow:'hidden',borderBottom:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <div style={{float:'left',opacity:0.01}}>
          <img src="ethfishtitle.png" alt="eth.fish" />
        </div>
        <Metamask init={this.init.bind(this)} Blockies={Blockies}/>

      </div>
    )
    let inventory = (
      <div style={{position:"fixed",right:0,top:75,width:200,border:"0px solid #a0aab5",color:"#DDDDDD",zIndex:99}} >
        <Inventory
          inventory={this.state.inventory}
          Ships={this.state.Ships}
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
        <Fish fish={this.state.fish} width={width} height={height} horizon={horizon+100} />
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
      </div>
    );
  }
}

const DEBUGCONTRACTLOAD = false;
let loadContract = async (contract)=>{
  if(DEBUGCONTRACTLOAD) console.log("HITTING GALLEASS for address of "+contract)
  if(DEBUGCONTRACTLOAD) console.log(contracts["Galleass"])
  let hexContractName = web3.utils.asciiToHex(contract);
  if(DEBUGCONTRACTLOAD) console.log(hexContractName)
  let thisContractAddress = await contracts["Galleass"].methods.getContract(hexContractName).call()
  if(DEBUGCONTRACTLOAD) console.log("ADDRESS OF SEA:",thisContractAddress)
  let thisContractAbi = require('./'+contract+'.abi.js');
  if(DEBUGCONTRACTLOAD) console.log("LOADING",contract,thisContractAddress,thisContractAbi)
  contracts[contract] = new web3.eth.Contract(thisContractAbi,thisContractAddress)
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

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  );

export default App;
