import React, { Component } from 'react';
import { sha3_224 } from 'js-sha3';

const shipwidth = 62

class Ships extends Component {
  constructor(props) {
    super(props);
    let fillerShips = []
    //make some fake fish while it loads
    for(let f=0;f<14;f++){
      fillerShips["0x"+sha3_224(""+f+Math.random())]=this.createRandomFakeShipForLoading(f)
    }

    this.state = {
      fillerShips:fillerShips
    }
  }
  createRandomFakeShipForLoading(f){
    let sailing = (getRandomInt(0,5)>0)
    let direction = (getRandomInt(0,1)==0)
    let fishing = false;
    if(!sailing){
      fishing = (getRandomInt(0,1)==0)
    }
    return {timestamp:0,id:f,floating:true,sailing,sailing,direction:direction,fishing:fishing,location:Math.random()*65500,blockNumber:1}
  }
  openUrl(url){
    window.open(url)
  }
  render(){
    let {ships,web3,blockNumber,shipSpeed,width,height,horizon} = this.props
    let renderedShips = []



    var thereAreShips = false
    for(var f in ships) {
      thereAreShips=true
      break
    }
    if(!thereAreShips){
      ships=this.state.fillerShips
    }

    for(let b in ships){
      //console.log(ships[b],b)
      let translatedX
      let image = "fishingboat";
      if(ships[b].sailing){
        image+="sailing";
        let blocksTraveled = blockNumber-ships[b].blockNumber;
        let pixelsTraveled = shipSpeed*blocksTraveled;
        if(!ships[b].direction){
          pixelsTraveled*=-1
        }
        let adjustedLocation = parseInt(ships[b].location)+pixelsTraveled;
        translatedX = width*(adjustedLocation/65535);
        while(translatedX>width)
        {
          translatedX-=(width);
        }
        while(translatedX<(shipwidth*-1))
        {
          translatedX+=(width);
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
      let idHash
      if(web3&&web3.utils){
        idHash = web3.utils.sha3(""+ships[b].id,b)
      }else{
        idHash = "0x"+sha3_224(""+ships[b].id+b)
      }

      //console.log("idHash",idHash)
      let lastTwoBytes = idHash.substring(idHash.length-2);
      let idTopOffset = lastTwoBytes.substring(0,1);
      let idLeftOffset = lastTwoBytes.substring(1);
      idTopOffset = 1+parseInt(idTopOffset, 16)*3
      idLeftOffset = (7-parseInt(idLeftOffset, 16))

      let extraZ = 0

      if(ships[b]&&ships[b].owner&&ships[b].owner.toLowerCase()==this.props.account.toLowerCase()){
        //pull the current account's ship forward so it is easier to see
        //// this will cause some inconsistancies when looking at multiple different screens at once though
        extraZ+=25
        idTopOffset+=40
      }


      renderedShips.push(
        <div key={"ship"+b} onClick={this.openUrl.bind(this,this.props.etherscan+"address/"+b)}
          style={{
            zIndex:20+idTopOffset+extraZ,
            position:'absolute',
            left:translatedX+idLeftOffset-(shipwidth/2),
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
            top:8,
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
    return (
      <div>
        {renderedShips}
      </div>
    )
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Ships;
