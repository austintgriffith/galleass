import React, { Component } from 'react';
import Writing from '../Writing.js'
import BuySellItem from './BuySellItem.js'
class BuySellOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:1,
      toAddress:""
    }
  }
  handleChangeNewSellTokenAddress(e){
    this.setState({newSellTokenAddress:e.target.value})
  }
  handleChangeNewSellTokenPrice(e){
    console.log("focus",e.target.value)
    this.setState({newSellTokenPrice:e.target.value})
  }
  render(){
/*
    let buyItems = this.props.buyArray.map((item)=>{
      return (
        <BuySellItem method="Buy" key={"buy"+item.first+item.second} {...item}/>
      )
    })

    let sellItems = this.props.sellArray.map((item)=>{
      return (
        <BuySellItem method="Sell" key={"sell"+item.first+item.second} {...item}/>
      )
    })
*/
//setSellPrice(x,y,tile,tokenAddress,price)
//


    return (
      <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="100%">
        <tbody>
          <tr>
            <td style={{width:"50%",verticalAlign:"top"}}>
              <div style={{marginBottom:10}}>
                <Writing string={"Selling"} size={32}/>
              </div>
              Address:<input
                style={{textAlign:'right',width:80,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="newSellTokenAddress" value={this.state.newSellTokenAddress} onChange={this.handleChangeNewSellTokenAddress.bind(this)}
              />
              Price:
              <input
                style={{textAlign:'right',width:30,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="newSellTokenPrice" value={this.state.newSellTokenPrice} onChange={this.handleChangeNewSellTokenPrice.bind(this)}
              />
              <img data-rh={"Start selling new token with address "+this.state.newSellTokenAddress+" for "+this.state.newSellTokenPrice+" Copper each."} data-rh-at="right" src="metamasksign.png"
              style={{maxHeight:42,cursor:"pointer",verticalAlign:'middle'}} onClick={this.props.setSellPrice.bind(this,this.props.landX,this.props.landY,this.props.index,this.state.newSellTokenAddress,this.state.newSellTokenPrice)}/>
            </td>
            <td style={{width:"50%",verticalAlign:"top"}}>
              <div style={{marginBottom:10}}>
                <Writing string={"Sell"} size={32}/>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}


export default BuySellOwner;
