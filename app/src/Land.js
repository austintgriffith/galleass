import React, { Component } from 'react';


class Land extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div style={{zIndex:20,position:'absolute',left:0,top:0,width:4000}}>
        <img src="leftedge.png" />
        <img src="milltile.png" />
        <img src="grasstile.png" />
        <img src="blank_grass_base.png" />
        <img src="foresttile.png" />
        <img src="coppermountaintile.png" />
        <img src="rightedge.png" />
      </div>
    )
  }
}

export default Land;
