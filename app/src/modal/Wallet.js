import React, { Component } from 'react';
import Writing from '../Writing.js'
import QRCode from 'qrcode.react'
import Blockies from 'react-blockies';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:0.001,
      toAddress:"",
    }
  }
  handleModalInputAddress(e){
    this.setState({amount:e.target.value})
  }
  handleModalInputToAddress(e){
    this.setState({toAddress:e.target.value})
  }
  render(){
    let fontSize = 21
    return (
      <div>
        <div style={{cursor:'pointer'}} onClick={()=>{
          let url = this.props.etherscan+"address/"+this.props.account;
          window.open(url)
        }}>
          <div style={{position:'absolute',left:24,top:24,padding:3}}>
            <Blockies
              seed={this.props.account.toLowerCase()}
              scale={8}
            />
          </div>
          <div>
            <Writing style={{opacity:0.9}} string={this.props.account} size={24}/>
          </div>
          <div style={{textAlign:'left',width:"100%",marginLeft:120,marginTop:3}}>
            <img src="ether.png" style={{maxHeight:32,verticalAlign:'middle'}}/> <Writing verticalAlign={"middle"}  string={this.props.modalObject.balance} size={36}/>
          </div>
        </div>

        <div style={{marginTop:30,marginBottom:30}}>
        <Writing string={"Send"} size={fontSize} verticalAlign={"middle"} space={5}/>
        <input
          style={{textAlign:'right',width:70,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
          type="text" name="amount" value={this.state.amount} onFocus={this.handleFocus} onChange={this.handleModalInputAddress.bind(this)}
        />
        <img src="ether.png" style={{maxHeight:24,verticalAlign:'middle'}}/>
         <Writing string={"to"} size={fontSize} verticalAlign={"middle"} space={5}/>
         <input
           style={{textAlign:'right',width:295,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
           type="text" name="toAddress" value={this.state.toAddress} onFocus={this.handleFocus} onChange={this.handleModalInputToAddress.bind(this)}
         />
         <img data-rh={"Send "+this.state.amount+" ETH to "+this.state.toAddress} data-rh-at="right" src="metamasksign.png"
         style={{maxHeight:42,cursor:"pointer",verticalAlign:'middle'}} onClick={this.props.sendEth.bind(this,this.state.amount,this.state.toAddress)}/>
        </div>

        <div style={{cursor:'pointer',padding:10}}>
          <QRCode size={220} value={this.props.account} />
        </div>

        <div style={{cursor:'pointer',padding:10}} onClick={()=>{
          let url = "https://wallet.ethereum.org/";
          window.open(url)
        }}>
         <Writing style={{opacity:0.9}} string={"View on wallet.ethereum.org"} size={16}/>
        </div>
      </div>
    )
  }
}


export default Wallet;
