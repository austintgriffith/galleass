import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class BuildTable extends Component {
  render(){
    return (
      <div onClick={this.props.clickFn.bind(this,this.props.tileIndex,2000)}>
        <img src="/buyvillage.png" />
      </div>
    )
  }
}


export default BuildTable;
