import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class ForestTile extends Component {
  render(){
    let tileIndex = this.props.modalObject.index;
    let buildTimberCampButton = ""
    if(!this.props.modalObject.citizens||!this.props.modalObject.citizens[0]||!this.props.modalObject.citizens[0].id){
      buildTimberCampButton = (
        <div>
          <div style={{marginTop:30}}>
            <Writing style={{verticalAlign:'middle',opacity:0.9}} string={"Move a citizen here (tile "+this.props.modalObject.index+") to build a Timber Camp."} size={20}/>
          </div>
          <div style={{marginTop:0}}>
            <Writing style={{verticalAlign:'middle',opacity:0.9}} string={"A Timber Camp generates Timber automatically."} size={20}/>
          </div>
        </div>
      )
    }else{
      buildTimberCampButton = (
        <div style={{marginTop:30}}>
          <img src="buildTimberCamp.png" data-rh-at="right" data-rh={"Spend 6 Copper and 1 Citizen to create a Timber Camp"} style={{cursor:"pointer"}}
            onClick={this.props.buildTimberCamp}
          />
        </div>
      )
    }
    return (
      <div style={{marginTop:30}}>
        <div style={{marginTop:0}}>
          <img src="extractRawTimber.png" data-rh-at="right" data-rh={"Spend 3 Copper to chop 1 Timber"} style={{cursor:"pointer"}}
            onClick={this.props.extractRawResource}
          />
        </div>
        {buildTimberCampButton}
      </div>
    )
  }
}
export default ForestTile;
