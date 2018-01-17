import React, { Component } from 'react';


const horizonFishPad = 60

const fishWidth = {
  "pinner": 50,
  "redbass": 60,
  "catfish": 60,
  "dangler": 60,
  "snark": 90
}

class Fish extends Component {
  constructor(props) {
    super(props);
    let fillerFish = []
    //make some fake fish while it loads
    for(let f=0;f<60;f++){
     fillerFish[this.props.web3.utils.keccak256(""+f+Math.random())]=this.createRandomFakeFishForLoading()
    }
    this.state = {
      fillerFish:fillerFish
    }
  }
  getRandomFishName(){
    let tempArray = []
    for(let i in fishWidth){
      tempArray.push(i)
    }
    return tempArray[Math.floor(Math.random()*tempArray.length)];
  }
  createRandomFakeFishForLoading(){
    this.getRandomFishName()
    return {timestamp:0,species:0,x:Math.random()*65500,y:Math.random()*65500,dead:false,image:this.getRandomFishName()}
  }
  render(){
    let {fish,width,height,horizon} = this.props

    var thereAreFish = false
    for(var f in fish) {
      thereAreFish=true
      break
    }
    if(!thereAreFish){
      console.log("NO FISH",fish)
      fish=this.state.fillerFish
    }

    let renderedFish = []
    for(let f in fish){
      if(!fish[f].dead){
        let opacityratio = (60000-fish[f].y)/60000; //80k because it looks right, totally just picked 80k
        let ratio = fish[f].y/50000; //50k because it looks right, totally just picked 50k
        let depth = Math.round(((height-horizon-horizonFishPad)*ratio))
        let opacity = opacityratio*.5;
        //console.log(opacity)
        let widthRatio = fish[f].x/65536
        let image = ""+fish[f].image+".png"
        let fishwidthpx = fishWidth[fish[f].image];

        let fishClass = ""
        if((parseInt(f[f.length-1],16))>7){
          fishClass="flip"
        }
        /*{f.substr(0,6)}*/
        renderedFish.push(
          <div key={"fish"+f} className={fishClass}  style={{position:"absolute",left:widthRatio*width,top:horizon+depth}}>
           <img
            src={image}
            style={{width:"70%",height:"90%",maxWidth:fishwidthpx,opacity:opacity}}
            onClick={()=>{console.log(f+" "+fish[f].species+" "+fish[f].x+" "+fish[f].y)}} />
          </div>
        )
      }
    }

    return (
      <div style={{zIndex:10,position:'absolute',left:0,top:0,width:4000,height:1000}}>
        {renderedFish}
      </div>
    )
  }
}

export default Fish;
