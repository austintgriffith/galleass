import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class CreateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:1,
      toAddress:"",
    }
  }
  componentDidMount(){
    if(this.props.modalObject.isFish){
      console.log("SETTING SELL AMOUNT TO BALANCE ")
      this.setState({fishSellAmount:this.props.modalObject.balance})
    }
  }
  handleFocus(){
    console.log("focus.")
  }
  handleModalInputAddress(e){
    this.setState({amount:e.target.value})
  }
  handleModalInputToAddress(e){
    this.setState({toAddress:e.target.value})
  }
  handleFishSellAmountChange(e){
    this.setState({fishSellAmount:e.target.value})
  }
  render(){
    let fontSize = 21

    let sellToFishmonger = ""
    if(this.props.modalObject.isFish){

      let thisPrice = parseInt(this.props.modalObject.prices[this.props.modalObject.name])
      console.log(this.props.modalObject.name,this.props.modalObject.prices,thisPrice)

      sellToFishmonger = (
        <div>
        <Writing string={"Sell"} size={fontSize} verticalAlign={"middle"} space={5}/>
        <input
          style={{textAlign:'right',width:40,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
          type="text" name="amount" value={this.state.fishSellAmount} onChange={this.handleFishSellAmountChange.bind(this)}
        />
          <Writing string={this.props.modalObject.name+" to the"} size={fontSize} verticalAlign={"middle"} space={5}/>
         <img style={{maxHeight:21,marginLeft:5,verticalAlign:"middle"}} src={"fishmonger.png"} />
          <Writing string={"Fishmonger for "+(thisPrice*this.state.fishSellAmount)+""} size={fontSize} verticalAlign={"middle"} space={5}/>
         <img style={{maxHeight:21,marginLeft:5,verticalAlign:"middle"}} src={"copper.png"} />
         <Writing string={"Copper"} size={fontSize} verticalAlign={"middle"} space={5}/>
         <img data-rh={"Sell "+this.state.fishSellAmount+" "+this.props.modalObject.name+" to the Fishmonger"} data-rh-at="right" src="metamasksign.png"
         style={{maxHeight:42,cursor:"pointer",verticalAlign:'middle'}} onClick={this.props.sellFish.bind(this,this.props.modalObject.name,this.state.fishSellAmount)}/>
        </div>
      )
    }
    return (
      <div style={{marginTop:60}}>

        {sellToFishmonger}

        <div style={{marginTop:40}}>
          <Writing string={"Send"} size={fontSize} verticalAlign={"middle"} space={5}/>
          <input
            style={{textAlign:'right',width:40,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
            type="text" name="amount" value={this.state.amount} onFocus={this.handleFocus} onChange={this.handleModalInputAddress.bind(this)}
          />
           <Writing string={this.props.modalObject.name+" to"} size={fontSize} verticalAlign={"middle"} space={5}/>
           <input
             style={{textAlign:'right',width:295,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
             type="text" name="toAddress" value={this.state.toAddress} onFocus={this.handleFocus} onChange={this.handleModalInputToAddress.bind(this)}
           />
           <img data-rh={"Send "+this.state.amount+" "+this.props.modalObject.name+" to "+this.state.toAddress} data-rh-at="right" src="metamasksign.png"
           style={{maxHeight:42,cursor:"pointer",verticalAlign:'middle'}} onClick={this.props.sendToken.bind(this,this.props.modalObject.name,this.state.amount,this.state.toAddress)}/>
        </div>

      </div>
    )
  }
}


export default CreateTable;
