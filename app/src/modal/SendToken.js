import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class CreateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:1,
      toAddress:""
    }
  }
  handleFocus(){
    console.log("focus")
  }
  handleModalInputAddress(e){
    console.log("focus",e.target.value)
    this.setState({amount:e.target.value})
  }
  handleModalInputToAddress(e){
    console.log("focus",e.target.value)
    this.setState({toAddress:e.target.value})
  }
  render(){
    let fontSize = 24
    return (
      <div>
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
    )
  }
}


export default CreateTable;
