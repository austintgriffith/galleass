import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class CreateCitizens extends Component {
  render(){
    return (
      <div>
        <div onClick={this.props.createCitizen.bind(this,"Fillet","Fillet","Fillet")}>
          <img  src={"createCitizen.png"} style={{cursor:"pointer"}}/>
        </div>
        <div onClick={this.props.createCitizen.bind(this,"Greens","Fillet","Fillet")}>
          <img  src={"createCitizenGreensFilletFillet.png"} style={{cursor:"pointer"}}/>
        </div>
      </div>
    )
  }
}


export default CreateCitizens;
