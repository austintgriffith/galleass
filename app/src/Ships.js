import React, { Component } from 'react';

const shipwidth = 62

class Ships extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    let {ships,web3,blockNumber,shipSpeed,width,height,horizon} = this.props
    let renderedShips = []
    for(let b in ships){
      //console.log(ships[b],b)
      let translatedX
      let image = "fishingboat";
      if(ships[b].sailing){
        image+="sailing";
        let blocksTraveled = blockNumber-ships[b].block;
        let pixelsTraveled = shipSpeed*blocksTraveled;
        if(!ships[b].direction){
          pixelsTraveled*=-1
        }
        let adjustedLocation = parseInt(ships[b].location)+pixelsTraveled;
        translatedX = width*(adjustedLocation/65535);
        while(translatedX>width)
        {
          translatedX-=(width+shipwidth);
        }
        while(translatedX<(shipwidth*-1))
        {
          translatedX+=(width+shipwidth);
        }
      }else if(ships[b].fishing){
          image+="fishing";
          translatedX = width*(ships[b].location/65535);
      }else{
        image+="floating";
        translatedX = width*(ships[b].location/65535);
      }
      let flagleft = 2;
      if(ships[b].direction){
        image+="east";
      }else{
        image+="west";
        flagleft=60
      }
      image+=".png";

      //offset ships based on their ids so when they are in the same place
      //we can see both of them
      let lastTwoBytes = b.substring(b.length-2);
      let idTopOffset = lastTwoBytes.substring(0,1);
      let idLeftOffset = lastTwoBytes.substring(1);
      idTopOffset = 1+parseInt(idTopOffset, 16)
      idLeftOffset = (7-parseInt(idLeftOffset, 16))*2

      renderedShips.push(
        <div key={"ship"+b} style={{
          zIndex:idTopOffset,
          position:'absolute',
          left:translatedX+idLeftOffset,
          top:horizon-28+idTopOffset,
          opacity:0.9,
          height:75,
          width:shipwidth
        }}>
        <img src={image} />
        <div style={{
          position:'absolute',
          top:8,
          left:flagleft
        }}>
        <this.props.Blockies
          seed={ships[b].owner.toLowerCase()}
          scale={2}
        />
        </div>
        </div>
      )
    }
    return (
      <div>
        {renderedShips}
      </div>
    )
  }
}

export default Ships;
