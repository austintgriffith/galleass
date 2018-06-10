import React, { Component } from 'react';

import Blockies from 'react-blockies';

class CitizenFace extends Component {
  render(){
    let imageStyle = {
      width:this.props.size,
      height:this.props.size,
      maxWidth:this.props.size,
      maxHeight:this.props.size,
      position:'absolute',
      left:4+this.props.size*this.props.offset+this.props.padding*this.props.offset,
      top:0,
    }
    let typeCount = {
      head: 4,
      hair: 3,
      nose: 5,
      mouth: 5,
      eyes: 6,
    }
    let images = {}
    for(let type in typeCount){
      images[type]= Math.floor(this.props.genes[type]/(65535/typeCount[type]))+1;
    }

    let blockie = ""
    if(this.props.owner){
      blockie = (
        <div style={{position:"absolute",top:imageStyle.top+this.props.size-21,left:imageStyle.left-7}}>
          <Blockies
          seed={this.props.owner.toLowerCase()}
          scale={2}
          />
        </div>
      )
    }

    return (
      <div style={{position:"relative",marginTop:this.props.size*-1}}>
        {blockie}
        <img style={imageStyle} src={"citizens/head_"+images['head']+".png"} />
        <img style={imageStyle} src={"citizens/eyes_"+images['eyes']+".png"} />
        <img style={imageStyle} src={"citizens/hair_"+images['hair']+".png"} />
        <img style={imageStyle} src={"citizens/nose_"+images['nose']+".png"} />
        <img style={imageStyle} src={"citizens/mouth_"+images['mouth']+".png"} />

      </div>
    )
  }
}
export default CitizenFace;
