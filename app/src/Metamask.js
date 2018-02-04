import React, { Component } from 'react';
import Writing from './Writing.js'

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
    },647)
    setInterval(this.checkMetamask.bind(this),1001)
    this.checkMetamask()
  }
  checkMetamask() {
    if (typeof window.web3 == 'undefined') {
      if(this.state.metamask!=0) this.setState({metamask:0})
      this.props.setHintMode(1);
    } else {
      this.props.setHintMode(0);
      window.web3.version.getNetwork((err,network)=>{
        //console.log("PEERS",window.web3.net)
        network = translateNetwork(network);
        let accounts
        try{
          window.web3.eth.getAccounts((err,_accounts)=>{
            if(err){
              if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
            }else{
              accounts = _accounts;
              if(!accounts){
                if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
              } else if(accounts.length<=0){
                if(this.state.metamask!=2) this.setState({metamask:2,network:network})
              } else{

                if(this.props.account&&this.props.account!=accounts[0]){
                  window.location.reload(true);
                }else{
                  if(this.state.metamask!=3) {
                    let etherscan = "https://etherscan.io/"
                    if(network=="Unknown"||network=="private"){
                      etherscan = "http://localhost:8000/#/"
                    }else if(network!="Mainnet"){
                      etherscan = "https://"+network.toLowerCase()+".etherscan.io/"
                    }
                    this.props.setEtherscan(etherscan)

                    this.setState({metamask:3,accounts:accounts,network:network},()=>{
                      this.props.init(accounts[0])
                    })
                  }
                }
              }
            }
          })
        }catch(e){
          console.log(e)
          if(this.state.metamask!=-1) this.setState({metamask:-1,network:network})
        }
      })
    }
  }
  render(){
    let metamask
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
      //setTimeout(()=>{
      //  window.location.reload();
      //},5000)
      //not installed
      metamask = (
        <a target="_blank" href="https://metamask.io/">
        <span style={this.props.textStyle}>
          <Writing string={"Install MetaMask to play"} size={20} space={5}/>
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="metamaskhah.png"
        />
        </a>
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
      //not installed
      metamask = (
        <div>
          <span style={this.props.textStyle}>
            <Writing string={"Unlock MetaMask to play"} size={20} space={5}/>
          </span>
          <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
            src="metamaskhah.png"
          />
        </div>
      )
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
      if(this.state.network=="Mainnet" || this.state.network=="Morden" || this.state.network=="Rinkeby" || this.state.network=="Kovan"){
        //console.log("goodblock",this.state.accounts[0])
        metamask = (
          <div style={{padding:4}}>
            <a target="_blank" href={this.props.etherscan+"address/"+this.state.accounts[0]}>
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
                <div><Writing string={"Please switch your network to Ropsten in MetaMask."} size={30} space={5}/></div>
              </span>
              <this.props.Blockies
              seed={this.state.accounts[0]}
              scale={6}
              />
            </a>
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
                textAlign:"right",

              }}>
              <a target="_blank" href={this.props.etherscan+"address/"+this.state.accounts[0]}>
                <div>
                  <Writing string={this.state.accounts.length > 0 ? this.state.accounts[0] : "Loading..."} size={20} space={5}/>
                </div>
              </a>
                <div>
                  <Writing string={this.state.network} size={26} space={5}/>
                  <a target="_blank" href={this.props.etherscan+"block/"+this.props.blockNumber}>
                    <Writing string={this.props.blockNumber} size={26} space={10}/>
                  </a>
                  {littleBlockLoaderBar}
                </div>
              </span>

              <this.props.Blockies
              seed={this.state.accounts[0]}
              scale={6}
              />

          </div>
        )
      }

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
  }else{
    return "Unknown";
  }
}
