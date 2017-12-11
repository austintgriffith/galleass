import React, { Component } from 'react';

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
  }
  componentDidMount(){
  }
  render(){
    let renderedClouds = [];
    for(let c in this.props.clouds){
      let blocksTraveled = this.props.blockNumber - this.props.clouds[c].block;
      let image = "cloud"+this.props.clouds[c].image+".png";
      let speed = (256-(parseInt(this.props.clouds[c].speed*2)))
      let startingLocation = parseInt(this.props.clouds[c].location);
      let location = startingLocation + blocksTraveled*speed;
      let cloudSize = cloudSizes[this.props.clouds[c].image-1];
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
      if(this.props.clouds[c].image>=6) top=0;
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

export default Clouds;
