import React, { Component } from 'react';

class Land extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: 0
    }
  }
  async componentDidMount() {
    const accounts = await promisify(cb => this.props.web3.eth.getAccounts(cb));
    this.setState({account:accounts[0]})
  }
  edgeTile(location,direction){
    //if(direction=="left") location-=114;
    return (
      <div key={"Land"+location} style={{
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
  landTile(location,owner,type,buttons){

    let blockieOpacity = 0.1
    if(this.state.account&&owner.toLowerCase()==this.state.account.toLowerCase()){
      blockieOpacity = 0.7
    }
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("'+type+'tile.png")',
        backgroundRepeat:'no-repeat',
        width:87,
        height:125
      }}>
      <div style={{position:'absolute',left:36,top:-23,opacity:blockieOpacity}}>
        <this.props.Blockies
          seed={owner.toLowerCase()}
          scale={2}
        />
      </div>
      <div style={{position:"relative",marginLeft:87/2-20,marginTop:-40}}>
        {buttons}
      </div>
      </div>
    )
  }
  hillsMain(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    let blockieOpacity = 0.1
    if(this.state.account&&owner.toLowerCase()==this.state.account.toLowerCase()){
      blockieOpacity = 0.7
    }
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_hills.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
      <div style={{position:'absolute',left:50,top:-23,opacity:blockieOpacity}}>
        <this.props.Blockies
          seed={owner.toLowerCase()}
          scale={2}
        />
      </div>
      </div>
    )
  }
  grassMain(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    let blockieOpacity = 0.1
    if(this.state.account&&owner.toLowerCase()==this.state.account.toLowerCase()){
      blockieOpacity = 0.7
    }
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_grass.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
      <div style={{position:'absolute',left:50,top:-23,opacity:blockieOpacity}}>
        <this.props.Blockies
          seed={owner.toLowerCase()}
          scale={2}
        />
      </div>
      </div>
    )
  }
  streamMain(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    let blockieOpacity = 0.1
    if(this.state.account&&owner.toLowerCase()==this.state.account.toLowerCase()){
      blockieOpacity = 0.7
    }
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_stream.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
      <div style={{position:'absolute',left:50,top:-23,opacity:blockieOpacity}}>
        <this.props.Blockies
          seed={owner.toLowerCase()}
          scale={2}
        />
      </div>
      </div>
    )
  }
  villageTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_hills.png")',
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
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_harbor.png")',
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
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_grass.png")',
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
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location,
        backgroundImage:'url("blank_hills.png")',
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
  courthouseTile(location,owner){
    let mainWidth = 120
    let mainHeight = 125
    return (
      <div key={"Land"+location} style={{
        position:'absolute',
        left:location-(mainWidth/2),
        backgroundImage:'url("blank_hills.png")',
        backgroundRepeat:'no-repeat',
        width:mainWidth,
        height:mainHeight
      }}>
        <img style={{position:'absolute',top:-33,left:52}} src="flagpolesmaller.png" />
        <div style={{position:'absolute',left:29,top:-31}}>
          <this.props.Blockies
            seed={owner.toLowerCase()}
            scale={3}
          />
        </div>
        <img style={{position:'absolute',top:10,left:15}} src="courthouse.png" />
      </div>
    )
  }
  wrapLandTileWithLink(name,index,location,tileCode){
    return (
      <div key={"landtile"+index+"at"+location} style={{cursor:"pointer"}} onClick={this.props.tileClick.bind(this,name,index,location)}>
        {tileCode}
      </div>
    )
  }
  render(){
    let DEBUGLANDRENDER = false;
    if(this.props.land){
      if(DEBUGLANDRENDER) console.log("contract",this.props.land)

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
          tempIsland.push({tile:thisTile,index:l,owner:this.props.landOwners[l]})
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

      let tiles = []


      let tileCount = 0

      for(let i in islands){

        if(typeof islands[i] == "number"){
          //ocean
          if(DEBUGLANDRENDER) console.log("(WATER)")
          currentPixelLocation+=95
          tileCount++
        }else{
          if(DEBUGLANDRENDER) console.log("LEFT EDGE")
          tiles.push(this.edgeTile(currentPixelLocation,"left"))
          currentPixelLocation+=114
          for(let t in islands[i]){

            let buttons = []

            let buttonCount = 0
            for(let r in this.props.resources[tileCount]){

              let amount = parseInt(this.props.resources[tileCount][r])
              for(let c=0;c<amount;c++){
                let offset = (10*c)-(10*amount)
                //console.log("offset",offset)
                let thisTileCount = tileCount
                buttons.push(
                  <div key={"Button"+t+"_"+r+"_"+c} style={{
                    width:40,
                    height:40,
                    position:'absolute',
                    left:0,
                    top:offset+15,
                  }} onClick={(e)=>{
                    this.props.collect("TimberCamp",thisTileCount)
                    e.preventDefault()
                    e.stopPropagation()
                    return false
                  }}>
                    <img src="collectTimber.png" style={{maxWidth:40,maxHeight:40}} />
                  </div>
                )
              }
            }
            tileCount++

            if(DEBUGLANDRENDER) console.log("ADD TILE",islands[i][t])
            if(islands[i][t].tile==1){
              tiles.push(
                this.wrapLandTileWithLink("Grass",islands[i][t].index,currentPixelLocation,
                  this.hillsMain(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==2){
              tiles.push(
                this.wrapLandTileWithLink("Grass",islands[i][t].index,currentPixelLocation,
                  this.grassMain(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==3){
              tiles.push(
                this.wrapLandTileWithLink("Stream",islands[i][t].index,currentPixelLocation,
                  this.streamMain(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==50){
              tiles.push(
                this.wrapLandTileWithLink("Grass Resource",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"grass",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==51){
              tiles.push(
                this.wrapLandTileWithLink("Forest Resource",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"forest",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==52){
              tiles.push(
                this.wrapLandTileWithLink("Mountain Resource",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"mountain",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==53){
              tiles.push(
                this.wrapLandTileWithLink("Copper Mountain Resource",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"coppermountain",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==54){
              tiles.push(
                this.wrapLandTileWithLink("Silver Mountain Resource",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"silvermountain",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==100){
              tiles.push(
                this.wrapLandTileWithLink("Harbor",islands[i][t].index,currentPixelLocation,
                  this.harborTile(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==101){
              tiles.push(
                this.wrapLandTileWithLink("Fishmonger",islands[i][t].index,currentPixelLocation,
                  this.fishMongerTile(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==102){
              tiles.push(
                this.wrapLandTileWithLink("Castle",islands[i][t].index,currentPixelLocation,
                  this.castleTile(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }else if(islands[i][t].tile==150){
              tiles.push(
                this.wrapLandTileWithLink("Timber Camp",islands[i][t].index,currentPixelLocation,
                  this.landTile(currentPixelLocation,islands[i][t].owner,"timbercamp",buttons)
                )
              )
              currentPixelLocation+=87
            }else if(islands[i][t].tile==2000){
              //console.log("VILLAGE:",islands[i][t])
              tiles.push(
                this.wrapLandTileWithLink("Village",islands[i][t].index,currentPixelLocation,
                  this.villageTile(currentPixelLocation,islands[i][t].owner,buttons)
                )
              )
              currentPixelLocation+=120
            }



          }
          if(DEBUGLANDRENDER) console.log("RIGHT EDGE")
          tiles.push(this.edgeTile(currentPixelLocation,"right"))
          currentPixelLocation+=114
        }


      }

      return (
        <div style={{zIndex:20,position:'absolute',left:0,top:0,width:4000}}>
          <div style={{position:'absolute',left:((4000-currentPixelLocation)/2)}}>
            {tiles}
          </div>
        </div>
      )
    }else{
      //render some fake stuff just to get the graphics preloaded and the world looking normal
      return (
        <div style={{zIndex:20,position:'absolute',left:0,top:0,width:4000}}>



          {this.edgeTile(500-60-87*2-114,"left")}
          {this.landTile(500-60-87*2,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.landTile(500-60-87,"0x34aA3F359A9D614239015126635CE7732c18fDF3","mountain")}
          {this.villageTile(500-60,"0xab5801a7d398351b8be11c439e05c5b3259aec9b")}
          {this.landTile(500+60,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.edgeTile(500+60+87,"right")}

          {this.edgeTile(1200-60-87-114,"left")}
          {this.landTile(1200-60-87,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.castleTile(1200-60,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
          {this.streamMain(1200+60,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
          {this.edgeTile(1200+60+120,"right")}

          {this.edgeTile(2000-60-87*2-114,"left")}
          {this.landTile(2000-60-87*2,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.landTile(2000-60-87,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.harborTile(2000-60,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
          {this.landTile(2000+60,"0x34aA3F359A9D614239015126635CE7732c18fDF3","grass")}
          {this.landTile(2000+60+87,"0x34aA3F359A9D614239015126635CE7732c18fDF3","mountain")}
          {this.landTile(2000+60+87*2,"0x34aA3F359A9D614239015126635CE7732c18fDF3","forest")}
          {this.fishMongerTile(2000+60+87*3+60-60,"0x34aA3F359A9D614239015126635CE7732c18fDF3")}
          {this.landTile(2000+60+120+87*3,"0x34aA3F359A9D614239015126635CE7732c18fDF3","grass")}
          {this.landTile(2000+60+120+87*4,"0x34aA3F359A9D614239015126635CE7732c18fDF3","corn")}
          {this.edgeTile(2000+60+120+87*5,"right")}

        </div>
      )
    }


  }
}


const promisify = (inner) =>
new Promise((resolve, reject) =>
inner((err, res) => {
  if (err) { reject(err) }

  resolve(res);
})
);

export default Land;
