import React, { Component } from 'react';
import './App.css';
import galleassAddress from './Address.js'
import galleassAbi from './Galleass.abi.js'
import Blockies from 'react-blockies';
import Fish from './Fish.js'
import Ships from './Ships.js'
import Clouds from './Clouds.js'
import Metamask from './Metamask.js'
var Web3 = require('web3');
let width = 4000;
let height = 1050;
let horizon = 300;
let shipSpeed = 1000;
let contracts = {};
let web3;

const GWEI = 4;
const GAS = 100000;


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

  if(!contracts["Sea"]) finishedLoading=false;
  if(!contracts["Harbor"]) finishedLoading=false;

  if(finishedLoading) {
    console.log("Finished Loading")

    clearInterval(waitInterval);
    this.setState({contractsLoaded:true})

    this.syncClouds()
    setInterval(this.syncBlockNumber.bind(this),503)
    this.syncBlockNumber()
    setInterval(this.syncFish.bind(this),3001)
    this.syncFish()
    setInterval(this.syncShips.bind(this),2003)
    this.syncShips()
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    web3 = new Web3(window.web3.currentProvider)
    if(DEBUGCONTRACTLOAD) console.log("galleassAddress",galleassAddress)
    contracts["Galleass"] = new web3.eth.Contract(galleassAbi,galleassAddress)
    this.state = {fish:[],ships:[],clouds:[],blockNumber:0};

    loadContract("Sea")
    loadContract("Harbor")

    waitInterval = setInterval(waitForAllContracts.bind(this),1000)
  }
  init(account) {
    console.log("Init "+account+"...")
    this.setState({account:account})
  }
  async syncBlockNumber(){
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
      //let id = ships[b].returnValues.sender.toLowerCase()
      let id = ships[b].returnValues.id
      let timestamp = ships[b].returnValues.timestamp
      if(!storedShips[id]||storedShips[id].timestamp < timestamp){
        if(DEBUG_SYNCSHIPS) console.log(ships[b].returnValues)
        updated=true;
        storedShips[id]={
          timestamp:timestamp,
          owner:ships[b].returnValues.owner,
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
    if(DEBUG_SYNCFISH) console.log("Sync Fish")
    //this wont scale
    //you'll need to work through the chain
    // in chunks and then stay up to date
    let fish = await contracts["Sea"].getPastEvents('Fish', {
        fromBlock: 0,
        toBlock: 'latest'
    })
    if(DEBUG_SYNCFISH) console.log("fish...",fish)
    let storedFish = this.state.fish;
    for(let f in fish){
      let id = fish[f].returnValues.id
      let species = fish[f].returnValues.species
      let timestamp = fish[f].returnValues.timestamp
      if("0x0000000000000000000000000000000000000000" == species){
        console.log("Fish dead")
        delete storedFish[id];
      }else if(!storedFish[id] || storedFish[id].timestamp < timestamp){
        if(DEBUG_SYNCFISH) console.log(id)
        let result = await contracts["Sea"].methods.fishLocation(id).call()
        storedFish[id]={timestamp:timestamp,species:species,x:result[0],y:result[1]};
      }
    }
    if(DEBUG_SYNCFISH) console.log(storedFish)
    this.setState({fish:storedFish})
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
      })
    })
  }
  reelIn(){
    console.log("REEL IN")
    window.web3.eth.getAccounts((err,_accounts)=>{
      //console.log(_accounts)

      let bestDist = width*width
      let bestId = false
      let myShip = this.state.ships[this.state.account];

      for(let f in this.state.fish){
        console.log("f",f)
        let a = parseInt(this.state.fish[f].x)
        let b = parseInt(myShip.location)
        console.log(a,b)
        let x = myShip.location-this.state.fish[f].x
        let y = 0-this.state.fish[f].y
        console.log(x,y)
        let diff = Math.sqrt(x*x + (y*y/8));
        console.log(diff)
        //console.log("this.state.fish.x",this.state.fish[f].x,"myShip.location",myShip.location,diff)
        if( diff < bestDist ){

          bestDist=diff
          bestId=f
          console.log("found closer ",bestDist,bestId)
        }
      }
      //console.log(myShip)
      console.log(this.state.bait)
      console.log("finally ",bestDist,bestId)

      contracts["Sea"].methods.reelIn(bestId,this.state.bait).send({
        from: _accounts[0],
        gas:GAS,
        gasPrice:GWEI * 1000000000
      }).then((receipt)=>{
        console.log("RESULT:",receipt)
      })
    })
  }
  render() {
    let buttons = [];

    let myShip = this.state.ships[this.state.account];
    let buttonsTop = horizon-200;
    let buttonsLeft = width/2;

    if(myShip&&myShip.location){
      let myLocation = 4000 * myShip.location / 65535
      buttonsLeft = myLocation
    }

    console.log(myShip)

    if(!myShip||!myShip.floating){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft,top:buttonsTop,opacity:0.9,}} onClick={this.embark.bind(this)}>
          <img src="gofishing.png" style={{maxWidth:150}}/>
        </div>
      )
    }else if(myShip.sailing){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-180,top:buttonsTop,opacity:0.9,}} onClick={this.dropAnchor.bind(this)}>
          <img src="dropanchor.png" style={{maxWidth:150}}/>
        </div>
      )
    }else if(myShip.fishing){
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-180,top:buttonsTop,opacity:0.9,}} onClick={this.reelIn.bind(this)}>
          <img src="reelin.png" style={{maxWidth:150}}/>
        </div>
      )
    }else{
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft+180,top:buttonsTop,opacity:0.9,}} onClick={this.setSail.bind(this,true)}>
          <img src="saileast.png" style={{maxWidth:150}}/>
        </div>
      )
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft,top:buttonsTop,opacity:0.9,}} onClick={this.castLine.bind(this,false)}>
          <img src="castLine.png" style={{maxWidth:150}}/>
        </div>
      )
      buttons.push(
        <div style={{zIndex:200,position:'absolute',left:buttonsLeft-180,top:buttonsTop,opacity:0.9,}} onClick={this.setSail.bind(this,false)}>
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
    let sea = (
      <div style={{position:"absolute",left:0,top:0,width:width,height:height,overflow:'hidden'}} >
        <div style={{position:'absolute',left:0,top:0,opacity:1,backgroundImage:"url('sky.jpg')",backgroundRepeat:'no-repeat',height:horizon,width:width}}></div>
        <Clouds clouds={this.state.clouds} horizon={horizon} width={width} blockNumber={this.state.blockNumber}/>
        <div style={{position:'absolute',left:0,top:horizon,opacity:1,backgroundImage:"url('oceanblack.jpg')",backgroundRepeat:'no-repeat',height:height+horizon,width:width}}></div>
        {buttons}
        <Ships ships={this.state.ships} width={width} height={height} horizon={horizon} Blockies={Blockies} web3={web3} shipSpeed={shipSpeed} blockNumber={this.state.blockNumber}/>
        <Fish fish={this.state.fish} width={width} height={height} horizon={horizon} />
      </div>
    )

    if(!this.state.contractsLoaded) buttons="";

    return (
      <div className="App" >
        {menu}
        {sea}
      </div>
    );
  }
}





export default App;
