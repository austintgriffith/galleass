import React, { Component } from 'react';
import Writing from '../Writing.js'
class GrassTile extends Component {
  render(){
    let tileIndex = this.props.modalObject.index;
    let buildButton = ""
    if(!this.props.modalObject.citizens||!this.props.modalObject.citizens[0]||!this.props.modalObject.citizens[0].id){
      buildButton = (
        <div>
          <div style={{marginTop:30}}>
            <Writing style={{verticalAlign:'middle',opacity:0.9}} string={"Move a citizen here (tile "+this.props.modalObject.index+") to build."} size={20}/>
          </div>
        </div>
      )
    }else{
      buildButton = (
        <div style={{marginTop:30}}>
          citizen build buttons
        </div>
      )
    }
    return (
      <div style={{marginTop:30}}>
        <div style={{marginTop:0}}>
          <img src="pickGreens.png" data-rh-at="right" data-rh={"Spend 2 Copper to pick Greens"} style={{cursor:"pointer"}}
            onClick={this.props.extractRawResource}
          />
        </div>
        {buildButton}
      </div>
    )
  }
}
export default GrassTile;
