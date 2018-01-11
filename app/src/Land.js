import React, { Component } from 'react';


class Land extends Component {
  constructor(props) {
    super(props);
  }
  edgeTile(location,direction){
    if(direction=="left") location-=114;
    return (
      <div style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("'+direction+'edge.png")',
        backgroundRepeat:'no-repeat',
        width:114,
        height:125
      }}>
      </div>
    )
  }
  landTile(location,type){
    return (
      <div style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("'+type+'tile.png")',
        backgroundRepeat:'no-repeat',
        width:87,
        height:125
      }}>
      </div>
    )
  }
  mainTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location-(mainWidth/2),
        backgroundImage:'url("blank_grass_base.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
        <img style={{position:'absolute',top:13,left:48}} src="villageback.png" />
        <img style={{position:'absolute',top:-25,left:58}} src="flagpolesmaller.png" />
        <div style={{position:'absolute',left:35,top:-23}}>
          <this.props.Blockies
            seed={owner.toLowerCase()}
            scale={3}
          />
        </div>
        <img style={{position:'absolute',top:10,left:16}} src="village.png" />
      </div>
    )
  }
  click(e){
    console.log(e.target)
  }
  fishMongerTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location-(mainWidth/2),
        backgroundImage:'url("blank_grass_base.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
        <img style={{position:'absolute',top:0,left:10}} src="fishmonger.png" />

      </div>
    )
  }
  castleTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location-(mainWidth/2),
        backgroundImage:'url("blank_grass_base.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
        <img style={{position:'absolute',top:-28,left:24}} src="castleback.png" />
        <img style={{position:'absolute',top:-67,left:45}} src="flagpolesmaller.png" />
        <div style={{position:'absolute',left:14,top:-65}}>
          <this.props.Blockies
            seed={owner.toLowerCase()}
            scale={4}
          />
        </div>
        <img style={{position:'absolute',top:-30,left:6}} src="newcastlefront.png" />
      </div>
    )
  }
  render(){
    return (
      <div style={{zIndex:20,position:'absolute',left:0,top:0,width:4000}}>

        {this.edgeTile(2000-60-87*2,"left")}

        {this.landTile(2000-60-87*2,"forest")}
        {this.landTile(2000-60-87,"forest")}
        {this.mainTile(2000,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
        {this.landTile(2000+60,"grass")}
        {this.landTile(2000+60+87,"mountain")}
        {this.landTile(2000+60+87*2,"forest")}
        {this.fishMongerTile(2000+60+87*3+60,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
        {this.landTile(2000+60+120+87*3,"grass")}
        {this.landTile(2000+60+120+87*4,"corn")}

        {this.edgeTile(2000+60+120+87*5,"right")}




        {this.edgeTile(500-60-87*2,"left")}
        {this.landTile(500-60-87*2,"corn")}
        {this.landTile(500-60-87,"corn")}
        {this.castleTile(500,"0xab5801a7d398351b8be11c439e05c5b3259aec9b")}
        {this.landTile(500+60,"forest")}
        {this.edgeTile(500+60+87,"right")}

        {this.edgeTile(1200-60-87,"left")}
        {this.landTile(1200-60-87,"forest")}
        {this.castleTile(1200,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
        {this.landTile(1200+60,"forest")}
        {this.edgeTile(1200+60+87,"right")}

      </div>
    )
  }
}

export default Land;
/*
<img src="leftedge.png" />
<img src="milltile.png" />
<img src="grasstile.png" />
<img src="blank_grass_base.png" />
<img src="foresttile.png" />
<img src="coppermountaintile.png" />
<img src="rightedge.png" />
 */
