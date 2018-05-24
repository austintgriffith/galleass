import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class CreateTable extends Component {
  render(){
    return (
      <div onClick={this.props.clickFn.bind(this)}>
        <img src="/createCitizen.png" />
      </div>
    )
  }
}


export default CreateTable;
