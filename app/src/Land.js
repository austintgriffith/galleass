import React, { Component } from 'react';


class Land extends Component {
  constructor(props) {
    super(props);
  }
  edgeTile(location,direction){
    //if(direction=="left") location-=114;
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
  mainTile(location){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_grass_base.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
      </div>
    )
  }
  villageTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location,
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
  harborTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_grass_harbor.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
        <img style={{position:'absolute',top:3,left:20}} src="harbor.png" />
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
        left:location,
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
        left:location,
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

  translateTile(uint8){
      if(uint8==1){
        return "grass";
      }
  }

  render(){
    if(this.props.land){
      console.log("contract",this.props.land)

      let islandCount=0;
      let islands = [];
      let tempIsland = [];
      let buildingIsland = false;

      for(let l=0;l<this.props.land.length;l++)
      {
        let thisTile = this.props.land[l]
        if(thisTile==0){
          if(buildingIsland){
            //finish island off
            islands[islandCount++]=tempIsland
            tempIsland=[]
            buildingIsland=false
          }
          islands[islandCount++]=1
        }else{
          tempIsland.push(thisTile)
          if(!buildingIsland){
            buildingIsland=true;
          }
        }
      }
      if(buildingIsland){
        //finish island off
        islands[islandCount++]=tempIsland
      }

      let currentPixelLocation = 0
      let renderedIslands = []

      let tiles = [];

      for(let i in islands){
        if(typeof islands[i] == "number"){
          //ocean
          currentPixelLocation+=95
        }else{
          console.log("LEFT EDGE")
          tiles.push(this.edgeTile(currentPixelLocation,"left"))
          currentPixelLocation+=114
          for(let t in islands[i]){
            console.log("ADD TILE",islands[i][t])
            if(islands[i][t]==1){
              tiles.push(this.mainTile(currentPixelLocation))
              currentPixelLocation+=120
            }else if(islands[i][t]==2){
              tiles.push(this.landTile(currentPixelLocation,"grass"))
              currentPixelLocation+=87
            }else if(islands[i][t]==3){
              tiles.push(this.landTile(currentPixelLocation,"forest"))
              currentPixelLocation+=87
            }else if(islands[i][t]==4){
              tiles.push(this.landTile(currentPixelLocation,"mountain"))
              currentPixelLocation+=87
            }else if(islands[i][t]==5){
              tiles.push(this.landTile(currentPixelLocation,"coppermountain"))
              currentPixelLocation+=87
            }else if(islands[i][t]==6){
              tiles.push(this.landTile(currentPixelLocation,"silvermountain"))
              currentPixelLocation+=87
            }
          }
          console.log("RIGHT EDGE")
          tiles.push(this.edgeTile(currentPixelLocation,"right"))
          currentPixelLocation+=114
        }


      }


/*
      let currentPixelLocation = 0;
      let buildingLand = false;

      let tiles = []
      for(let l=0;l<this.props.land.length;l++)
      {
        let thisTile = this.props.land[l]
        if(thisTile!=0){
          //LAND
          if(!buildingLand){
            tiles.push(this.edgeTile(currentPixelLocation,"left"))
            currentPixelLocation+=114;
          }
          tiles.push(this.edgeTile(currentPixelLocation,"left"))
        }else{
          //WATER
          if(buildingLand){
            tiles.push(this.edgeTile(currentPixelLocation,"right"))
            currentPixelLocation+=114;
          }
          currentPixelLocation+=87;

        }
      }
*/



      return (
        <div style={{zIndex:20,position:'absolute',left:0,top:0,width:4000}}>
          <div style={{position:'absolute',left:((4000-currentPixelLocation)/2)}}>
            {tiles}
          </div>
        </div>
      )
    }else{
      return (
        <div>LOADING</div>
      )
    }

  }
}
/*

{this.edgeTile(2000-60-87*2,"left")}
{this.landTile(2000-60-87*2,"forest")}
{this.landTile(2000-60-87,"forest")}
{this.harborTile(2000,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
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


 */
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
