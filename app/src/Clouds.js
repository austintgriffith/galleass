import React, { Component } from 'react';
import { sha3_224 } from 'js-sha3';

let cloudSizes = [
  [400,152],
  [600,228],
  [901,250],
  [810,280],
  [810,280],
  [810,280],
  [810,280],
];

class Clouds extends Component {
  constructor(props) {
    super(props);
    let fillerClouds = []
    //make some fake fish while it loads

    for(let f=0;f<7;f++){
      fillerClouds["0x"+sha3_224(""+f+Math.random())]=this.createRandomFakeCloudForLoading()
    }


    this.state = {
      fillerClouds:fillerClouds
    }
  }
  componentDidMount(){
  }
  createRandomFakeCloudForLoading(){
    return {location:Math.random()*65500,speed:Math.random()*200,image:getRandomInt(1,7),block:1}
  }
  render(){
    let renderedClouds = [];

    let {clouds} = this.props

    var thereAreClouds = false
    for(var c in clouds) {
      thereAreClouds=true
      break
    }
    if(!thereAreClouds){
      clouds=this.state.fillerClouds
    }

    //console.log("CLOUDS",clouds)
    for(let c in clouds){
      let blocksTraveled = this.props.blockNumber - clouds[c].block;
      let image = "cloud"+clouds[c].image+".png";
      let speed = (256-(parseInt(clouds[c].speed*2)))
      let startingLocation = parseInt(clouds[c].location);
      let location = startingLocation + blocksTraveled*speed;
      let cloudSize = cloudSizes[clouds[c].image-1];
      let cloudwidth = cloudSize[0];
      location = this.props.width * (location/65535);
      while(location>this.props.width)
      {
        location-=(this.props.width+cloudwidth);
      }
      while(location<(cloudwidth*-1))
      {
        location+=(this.props.width+cloudwidth);
      }
      let top = (this.props.horizon-cloudSize[1]+2);
      if(clouds[c].image>=6) top=0;
      renderedClouds.push(
        <div
          key={"cloud"+c}
          style={{
            zIndex:1,
            position:'absolute',
            left:location,
            top:top,
            opacity:.9,
            backgroundImage:"url('"+image+"')",
            height:cloudSize[1],
            width:cloudwidth
          }}
        />
      )
    }
    return (
      <div>
        {renderedClouds}
      </div>
    )
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Clouds;
