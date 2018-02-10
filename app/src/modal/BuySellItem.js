import React, { Component } from 'react';
import Writing from '../Writing.js'
class BuySellItem extends Component {
  render(){
    const textSize = 28

    let clickImage=""
    if(typeof this.props.clickFn == "function"){
      clickImage = (
        <img data-rh={this.props.method+" "+this.props.amount+" "+this.props.first.toLowerCase()+" for "+this.props.price+" "+this.props.second.toLowerCase()} data-rh-at="right"  src="metamasksign.png" style={{maxHeight:textSize,marginLeft:10,cursor:"pointer"}} onClick={this.props.clickFn}/>
      )
    }

    let firstImage
    if(this.props.balance){
      firstImage = (
        <img data-rh={this.props.balance} data-rh-at="bottom" src={this.props.first+".png"} style={{maxHeight:textSize}}/>
      )
    }else{
      firstImage = (
        <img src={this.props.first+".png"} style={{maxHeight:textSize}}/>
      )
    }

    return (
      <div>
        <Writing string={this.props.amount} size={textSize} space={5}/> {firstImage} <Writing string={":"} size={textSize}/> <Writing string={this.props.price} size={textSize} space={5}/> <img style={{maxHeight:textSize}} src={this.props.second+".png"} />
        {clickImage}
      </div>
    )
  }
}


export default BuySellItem;
