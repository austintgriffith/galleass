import React, { Component } from 'react';


const horizonFishPad = 60

class Fish extends Component {
  constructor(props) {
    super(props);
  }
  //({fish[f].x},{fish[f].y})
  render(){
    let {fish,width,height,horizon} = this.props
    let renderedFish = []
    for(let f in fish){
      let ratio = fish[f].y/80000; //80k because it looks right, totally just picked 80k
      let depth = Math.round(((height-horizon-horizonFishPad)*ratio))
      let opacity = (1-ratio)*0.7;
      let widthRatio = fish[f].x/65536
      renderedFish.push(
        <div key={"fish"+f} style={{position:"absolute",left:widthRatio*width,top:horizon+depth}}>
         <img
          src="fish1.png"
          style={{maxWidth:50,opacity:opacity}}
          onClick={()=>{console.log(f+" "+fish[f].species+" "+fish[f].x+" "+fish[f].y)}} />
        </div>
      )
    }
    return (
      <div style={{zIndex:10,position:'absolute',left:0,top:0,width:4000,height:1000}}>
        {renderedFish}
      </div>
    )
  }
}

export default Fish;
