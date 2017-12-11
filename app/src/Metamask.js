import React, { Component } from 'react';

let CHECKFORMAINNET = false

class Metamask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:0
    }
  }
  componentDidMount(){
    setInterval(this.checkMetamask.bind(this),401)
    this.checkMetamask()
  }
  checkMetamask() {

    if (typeof window.web3 == 'undefined') {
      if(this.state.metamask!=0) this.setState({metamask:0})
    } else {
      if(CHECKFORMAINNET && window.web3.version.network!=1){
        if(this.state.metamask!=1) this.setState({metamask:1})
      }else{
        let accounts
        try{
          window.web3.eth.getAccounts((err,_accounts)=>{
            if(err){
              if(this.state.metamask!=-1) this.setState({metamask:-1})
            }else{
              accounts = _accounts;
              if(!accounts){
                if(this.state.metamask!=-1) this.setState({metamask:-1})
              } else if(accounts.length<=0){
                if(this.state.metamask!=2) this.setState({metamask:2})
              } else{
                if(this.state.metamask!=3) {
                  this.setState({metamask:3,accounts:accounts},()=>{
                    this.props.init(accounts[0])
                  })

                }
              }
            }
          })
        }catch(e){
          console.log(e)
          if(this.state.metamask!=-1) this.setState({metamask:-1})
        }

      }
    }
  }
  render(){
    let metamask
    if(-1==this.state.metamask){
      //not installed
      metamask = (
        <a target="_blank" href="https://metamask.io/">
        <span style={{paddingRight:8}}>
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
          <span style={{paddingRight:8}}>
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
        <span style={{paddingRight:8}}>
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
        <span style={{paddingRight:8}}>
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
        <span style={{paddingRight:8}}>
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
          <span style={{float:'left',marginTop:6,padding:10,color:'#444444'}}>
          {this.state.accounts.length > 0 ? this.state.accounts[0].substring(0,8) : "Loading..."}
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
      <div style={{float:'right',padding:2}}>
        {metamask}
      </div>
    )
  }
}

export default Metamask;
