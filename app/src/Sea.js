import React, { Component } from 'react';
import { sha3_224 } from 'js-sha3';

const shipwidth = 140

class Sea extends Component {
  constructor(props) {
    super(props);
  }
  openUrl(url){
    window.open(url)
  }
  render(){
    let {sea,web3,blockNumber,shipSpeed,width,height,horizon,landX,landY} = this.props
    let renderedSea = []

    for(let b in sea){
    //  console.log("SHIP "+b,ships[b],b)
      if(sea[b].floating && sea[b].x==landX && sea[b].y==landY ){
        let translatedX
        let image = "schooner";
        let direction = sea[b].destX>sea[b].x
        if(sea[b].sailing){
          image+="sailing";
          let blocksTraveled = blockNumber-sea[b].destBlock;
          let pixelsTraveled = shipSpeed*blocksTraveled;
          let adjustedLocation = parseInt(sea[b].location)+pixelsTraveled;
          translatedX = width*(adjustedLocation/65535);
          while(translatedX>width)
          {
            translatedX-=(width);
          }
          while(translatedX<(shipwidth*-1))
          {
            translatedX+=(width);
          }

        }else{
          image+="floating";
          translatedX = width*(sea[b].location/65535)-(shipwidth/2);
        }
        let flagleft = 2;
        if(direction){
          image+="east";
        }else{
          image+="west";
          flagleft=100
        }
        image+=".png";
        //offset ships based on their ids so when they are in the same place
        //we can see both of them
        let idHash
        if(web3&&web3.utils){
          idHash = web3.utils.sha3(""+sea[b].id,b)
        }else{
          idHash = "0x"+sha3_224(""+sea[b].id+b)
        }
        let idTopOffset = 0
        let idLeftOffset = 0
        //console.log("idHash",idHash)

        let schoonerPushDown = 100

        let extraZ = 0

        if(this.props && this.props.account && sea[b]&&sea[b].owner&&sea[b].owner.toLowerCase()==this.props.account.toLowerCase()){
          //pull the current account's ship forward so it is easier to see
          //// this will cause some inconsistancies when looking at multiple different screens at once though
          extraZ+=45
          idTopOffset+=75
        }else{
          let lastTwoBytes = idHash.substring(idHash.length-2);
          idTopOffset = lastTwoBytes.substring(0,1);
          idLeftOffset = lastTwoBytes.substring(1);
          idTopOffset = schoonerPushDown+1+parseInt(idTopOffset, 16)*3
          idLeftOffset = (7-parseInt(idLeftOffset, 16))
        }

        const INGORESHIP = "0xe7ae776ffdcdcf769fdc85d94a6d1c98ddb73c01";
        if(sea[b] && sea[b].owner && sea[b].owner.toLowerCase()=="0xe7ae776ffdcdcf769fdc85d94a6d1c98ddb73c01"){
          //ignore this ship, just a test to see how this would work
          //as the sea gets full there may have to be some scheme for displaying
          //only new ships or something
        }else{
          renderedSea.push(
            <div key={"sea"+b} onClick={this.openUrl.bind(this,this.props.etherscan+"address/"+b)}
              style={{
                zIndex:schoonerPushDown+20+idTopOffset+extraZ,
                position:'absolute',
                left:translatedX+idLeftOffset,
                top:horizon-28+idTopOffset,
                opacity:0.9,
                height:75,
                width:shipwidth,
                cursor:"pointer"
              }
            }>
              <a style={{zIndex:99}}>
                <img src={image} />
              </a>
              <div style={{
                position:'absolute',
                top:23,
                left:flagleft
              }}>
                <this.props.Blockies
                  seed={b.toLowerCase()}
                  scale={2}
                />
              </div>
            </div>
          )
        }

      }
    }
    return (
      <div>
        {renderedSea}
      </div>
    )
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Sea;
