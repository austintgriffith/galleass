import React, { Component } from 'react';

class Metamask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:0,
      network:0
    }
  }
  componentDidMount(){
    setInterval(this.checkMetamask.bind(this),2003)
    this.checkMetamask()
  }
  checkMetamask() {
    if (typeof window.web3 == 'undefined') {
      if(this.state.metamask!=0) this.setState({metamask:0})
    } else {
      window.web3.version.getNetwork((err,network)=>{
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
        <a target="_blank" href="https://metamask.io/">
        <span style={this.props.textStyle}>
        Unable to connect to network
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
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
        Install MetaMask and reload to play
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
        />
        </a>
      )
    }else if(this.state.metamask==1){
      //not installed
      metamask = (
        <div>
        <span style={this.props.textStyle}>
        MetaMask is on the wrong network
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
        />
        </div>
      )
    }else if(this.state.metamask==2){
      //not installed
      metamask = (
        <div>
          <span style={this.props.textStyle}>
            Unlock Metamask to play
          </span>
          <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
            src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
          />
        </div>
      )
    }else if(!this.state.accounts){

      metamask = (
        <div>
        <span style={this.props.textStyle}>
        Error Connecting
        </span>
        <img style={{maxHeight:45,padding:5,verticalAlign:"middle"}}
        src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
        />
        </div>
      )

    }else{
      //console.log("goodblock",this.state.accounts[0])
      metamask = (
        <div style={{padding:4}}>
          <a target="_blank" href={"https://etherscan.io/search?q="+this.state.accounts[0]}>
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
              <div>{this.state.accounts.length > 0 ? this.state.accounts[0].substring(0,12) : "Loading..."}</div>
              <div>{this.state.network} @ {this.props.blockNumber%10000}</div>
            </span>
            <this.props.Blockies
            seed={this.state.accounts[0]}
            scale={6}
            />
          </a>
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
  }else{
    return "Unknown";
  }
}
