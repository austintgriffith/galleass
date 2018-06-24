import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class SendToTile extends Component {
  constructor(props) {
    super(props);

    let defaultToken = "Copper"
    if(props.defaultToken){
      defaultToken = props.defaultToken
    }

    this.state = {
      amount:1,
      tokenName:defaultToken
    }
  }
  handleModalInputAddress(e){
    this.setState({amount:e.target.value})
  }
  handleModalChangeTokenName(e){
    console.log("tokenName:",e.target.value)
    this.setState({tokenName:e.target.value})
  }
  handleFishSellAmountChange(e){
    this.setState({fishSellAmount:e.target.value})
  }
  render(){
    let fontSize = 21

    let tokenOptions = this.props.inventoryTokens.map((tokenName)=>{
      return (
        <option key={tokenName}>{tokenName}</option>
      )
    })

    return (
      <div style={{position:'absolute',right:21,bottom:43}}>
        <div style={{marginTop:40}}>
          <Writing string={"Send"} size={fontSize} verticalAlign={"middle"} space={5}/>
          <input
            style={{textAlign:'right',width:40,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
            type="text" name="amount" value={this.state.amount} onFocus={this.handleFocus} onChange={this.handleModalInputAddress.bind(this)}
          />
           <select
             style={{textAlign:'right',width:70,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
             value={this.state.tokenName} name="tokenName" onChange={this.handleModalChangeTokenName.bind(this)}
           >
            {tokenOptions}
           </select>
           <img data-rh={"Send "+this.state.amount+" of "+this.state.tokenName+" to "+this.props.modalObject.name} data-rh-at="right" src="metamasksign.png"
           style={{maxHeight:42,cursor:"pointer",verticalAlign:'middle'}} onClick={this.props.sendToTile.bind(this,this.props.modalObject.name,this.state.amount,this.state.tokenName)}/>
        </div>

      </div>
    )
  }
}


export default SendToTile;
