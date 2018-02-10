import React, { Component } from 'react';
import Writing from '../Writing.js'
import BuySellItem from './BuySellItem.js'
class BuySellTable extends Component {
  render(){

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

    return (
      <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="100%">
        <tbody>
          <tr>
            <td style={{width:"50%",verticalAlign:"top"}}>
              <div style={{marginBottom:10}}>
                <Writing string={"Buy"} size={32}/>
              </div>
              {buyItems}
            </td>
            <td style={{width:"50%",verticalAlign:"top"}}>
              <div style={{marginBottom:10}}>
                <Writing string={"Sell"} size={32}/>
              </div>
              {sellItems}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}


export default BuySellTable;
