import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class CreateTable extends Component {
  render(){
    return (
      <div onClick={this.props.clickFn.bind(this)}>
        <img src={this.props.image+".png"} style={{cursor:"pointer"}}/>
      </div>
    )
  }
}


export default CreateTable;