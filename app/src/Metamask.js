import React, { Component } from 'react';
import Writing from './Writing.js'
import {Motion, spring, presets} from 'react-motion';
import BurnerProvider from 'burner-provider';
var Web3 = require('web3');


let RPCENDPOINT = 'https://dai.poa.network'
if(window.location.href.indexOf("localhost")>=0){
  RPCENDPOINT = "http://localhost:8545"
}

class Metamask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:0,
      network:0
    }
  }
  componentDidMount(){
    this.forceUpdate()
    setInterval(()=>{
      this.forceUpdate()
    },2447)
    setInterval(this.checkMetamask.bind(this),3001)
    this.checkMetamask()
  }
  checkMetamask() {
    console.log("CHECKMM",typeof window.web3)
    if (typeof window.web3 == 'undefined') {

      var web3 = new Web3(new BurnerProvider(RPCENDPOINT));
      window.web3 = web3
      console.log("BURNER IS READY",window.web3)
      window.web3.eth.getAccounts((err,_accounts)=>{
        console.log("GOT BURNER ACCOUNT",_accounts)
        this.props.init(_accounts[0].toLowerCase())
      })
      window.web3.version = {}
      window.web3.version.getNetwork = (cb)=>{
        cb(null,100)
      }
      /*
      if(this.state.metamask!=0){
        //this is a switch from having web3 to losing it (logout)
        window.location.reload(true);
        this.setState({metamask:0})
      }
      this.props.setHintMode(1);*/
    } else {
      this.props.setHintMode(0);



      window.web3.version.getNetwork((err,network)=>{

        console.log("got network",network)

        network = translateNetwork(network);

        if(network!="xDai"){
          if(this.state.metamask!=2) this.setState({metamask:2,network:network})
        }else{
          //console.log("network",network)
          let accounts
          try{
            window.web3.eth.getAccounts((err,_accounts)=>{
              if(_accounts[0] && _accounts[0].toLowerCase) {
                _accounts[0] = _accounts[0].toLowerCase()
              }
              if(_accounts&&this.props.account&&this.props.account.toLowerCase()!=_accounts[0].toLowerCase()){
                window.location.reload(true);
              }
              if(err){
                console.log("metamask error",err)
                if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
              }else{
                accounts = _accounts;
                if(network){
                  let etherscan = "https://etherscan.io/"
                  if(network=="Unknown"||network=="private"){
                    etherscan = "http://localhost:8000/#/"
                  }else if(network=="xDai"){
                    etherscan = "https://blockscout.com/poa/xdai/"
                  }else if(network!="Mainnet"){
                    etherscan = "https://"+network.toLowerCase()+".etherscan.io/"
                  }
                  this.props.setEtherscan(etherscan)
                }

                if(!accounts){
                  if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
                } else if(accounts.length<=0){
                  if(this.state.metamask!=2) this.setState({metamask:2,network:network})
                } else{


                    if(this.state.metamask!=3) {
                      this.setState({metamask:3,accounts:accounts,network:network},()=>{
                        this.props.init(accounts[0].toLowerCase())
                      })
                    }

                }
              }
            })
          }catch(e){
            console.log(e)
            if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
          }
        }

      })
    }
  }
  render(){
    let metamask
    //console.log("this.state.metamask",this.state.metamask,"this.state.network",this.state.network)
    if(-1==this.state.metamask){
      //not installed
      metamask = (
        <a target="_blank"  href="https://metamask.io/">
        <span style={this.props.textStyle}>
          <Writing string={"Unable to connect to network"} size={20} space={5}/>
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="metamaskhah.png"
        />
        </a>
      )
    }else if(!this.state.metamask){
      //not installed
      let mmClick = ()=>{
        window.open('https://metamask.io', '_blank');
      }
      metamask = (
        <div style={{zIndex:999999}} onClick={mmClick}>
          <a target="_blank" href="https://metamask.io/">
          <span style={this.props.textStyle}>
            <Writing string={"Install MetaMask to play"} size={20} space={5}/>
          </span>
          <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
          src="metamaskhah.png"
          />
          </a>
        </div>
      )
    }else if(this.state.metamask==1){
      //not installed
      metamask = (
        <div>
        <span style={this.props.textStyle}>
          <Writing string={"MetaMask is on the wrong network"} size={20} space={5}/>
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
         src="metamaskhah.png"
        />
        </div>
      )
    }else if(this.state.metamask==2){
      if(this.state.network=="Mainnet" || this.state.network=="Morden" || this.state.network=="Kovan"|| this.state.network=="Ropsten"){
        //console.log("goodblock",this.state.accounts[0])
        metamask = (
          <div style={{padding:4}}>

              <span style={{
                float:'left',
                marginTop:3,
                paddingRight:10,
                zIndex:210,
                fontWeight:'bold',
                fontSize:21,
                color:"#222",
                textAlign:"right"
              }}>
                <div><Writing string={"Please switch your network to xDai: https:dai.poa.network"} size={24} space={5}/></div>
              </span>
              <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
                src="metamaskhah.png"
              />

          </div>
        )
      }else{
        metamask = (
          <div>
            <span style={this.props.textStyle}>
                <Writing string={"Unlock MetaMask on network xDai: http://dai.poa.network"} size={24} space={5}/>
            </span>
            <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
              src="metamaskhah.png"
            />
          </div>
        )
      }
    }else if(!this.state.accounts){

      metamask = (
        <div>
        <span style={this.props.textStyle}>
          <Writing string={"Error Connecting"} size={20} space={5}/>
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
         src="metamaskhah.png"
        />
        </div>
      )

    }else{

        //console.log("goodblock",this.state.accounts[0])
        //



        let timsSinceLastBlock = Date.now() - this.props.lastBlockWasAt
        let opacityOfLoader = 1
        if(timsSinceLastBlock>this.props.avgBlockTime) {
          opacityOfLoader = this.props.avgBlockTime/timsSinceLastBlock
          timsSinceLastBlock=this.props.avgBlockTime;
        }

        let loadedPercent = Math.floor(24*timsSinceLastBlock/this.props.avgBlockTime)+1

        if(!loadedPercent) loadedPercent=1
        if(loadedPercent>24) loadedPercent=24
        let littleBlockLoaderBar = (
          <img style={{maxHeight:20,opacity:opacityOfLoader,filter:"grayscale(65%)"}} src={"preloader_"+loadedPercent+".png"} />
        )

        /*.substring(0,20)*/

        const blockieAnimation = {stiffness: 50, damping: 14}

        let accountToShow = this.state.accounts.length > 0 ? this.state.accounts[0] : "Loading..."
        if(this.props.zoom <1){
          accountToShow=accountToShow.substr(0,22)
        }


        let accountDisplay = (
          <a target="_blank" href={this.props.etherscan+"address/"+this.state.accounts[0]}>
            <div style={{width:500}}>
              <Writing string={accountToShow} size={20} space={5}/>
            </div>
          </a>
        )


        let blockieClickFunction = this.props.clickBlockie

        try{
          const burnerKey = localStorage.getItem('metaPrivateKey')
          if(burnerKey){
            accountDisplay = (
              <a target="_blank" href={"https://xdai.io/pk#"+burnerKey}>
                <div style={{width:500}}>
                  <Writing string={accountToShow.substr(0,8)+"..."+accountToShow.substr(36)} size={32} space={5}/>
                  <div style={{zIndex:99,position:"absolute",right:42,top:-7}}><img src="/burner.png" style={{maxWidth:30}} /></div>
                </div>
              </a>
            )
            blockieClickFunction = ()=>{
              window.open("https://xdai.io/pk#"+burnerKey);
            }
          }
        }catch(e){console.log(e)}

        metamask = (
          <div style={{padding:4}}>

            <div style={{marginRight:50}}>
              <span style={{
                float:'left',
                marginTop:3,
                paddingRight:10,
                zIndex:210,
                fontWeight:'bold',
                fontSize:21,
                color:"#222",
                textAlign:"right",

              }}>
              {accountDisplay}
                <div>
                  <Writing string={this.state.network} size={26} space={5}/>
                  <a target="_blank" href={this.props.etherscan+"block/"+this.props.blockNumber}>
                    <Writing string={this.props.blockNumber} size={26} space={10}/>
                  </a>
                  {littleBlockLoaderBar}
                </div>
              </span>
            </div>
              <Motion
              defaultStyle={{
                right:10,
                top:10,
                size:6,
              }}
              style={{
                right: spring(this.props.blockieRight,blockieAnimation),// presets.noWobble)
                top: spring(this.props.blockieTop,blockieAnimation),
                size: spring(this.props.blockieSize,blockieAnimation),
              }}
              >
                {currentStyles => {
                  return (
                    <div style={{position:"absolute",right:currentStyles.right,top:currentStyles.top}} onClick={blockieClickFunction}>
                      <this.props.Blockies
                      seed={this.state.accounts[0]}
                      scale={currentStyles.size*1.1}
                      />
                    </div>
                  )
                }}
              </Motion>
          </div>
        )


    }
    return (
      <div style={{float:'right',padding:2,paddingRight:10}}>
      {metamask}
      </div>
    )
  }
}

export default Metamask;

function translateNetwork(network){
  if(network==5777){
    return "Private";
  }else if(network==1){
    return "Mainnet";
  }else if(network==2){
    return "Morden";
  }else if(network==3){
    return "Ropsten";
  }else if(network==4){
    return "Rinkeby";
  }else if(network==42){
    return "Kovan";
  }else if(network==100){
    return "xDai";
  }else{
    return "Unknown";
  }
}
