import React, { Component } from 'react';
class Citizen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      sellPrice: 0.001
    }
  }
  convertStatus(statusInt,data){
    if(statusInt==0){
      return "dead"
    }else if(statusInt==1){
      return "idle"
    }else if(statusInt==2){
      return "for sale ("+this.props.web3.utils.fromWei(""+data,"ether")+")"
    }else{
      return "unknown"
    }
  }
  handleInput(type,e){
    let update = {}
    update[type]=e.target.value
    this.setState(update)
  }
  render(){
    let menu
    if(this.state.menu=="sellCitizen"){
      menu = (
        <div>
          <img src="exit.png" style={{cursor:"pointer",maxHeight:28,marginRight:5,verticalAlign:'middle'}} onClick={()=>{
            this.setState({menu:false})
          }}/>
          Sale Price:
          <input style={{width:50,padding:5,border:'2px solid #ccc',borderRadius:5}}
            type="text" value={this.state.sellPrice} onFocus={this.handleFocus}
            onChange={this.handleInput.bind(this,"sellPrice")}
          />
          <img src="ether.png" style={{maxHeight:20,marginLeft:4,verticalAlign:'middle'}} />
          <img src="metamasksign.png" style={{cursor:"pointer",maxHeight:28,marginLeft:5,verticalAlign:'middle'}} onClick={()=>{
            this.props.setCitizenPrice(this.props.id,this.state.sellPrice)
          }}/>
        </div>
      )
    }else{
      menu = (
        <img src="sellCitizen.png" style={{cursor:"pointer",maxHeight:40,marginBottom:-5}} onClick={()=>{
          this.setState({menu:"sellCitizen"})
        }}/>
      )
    }
    let imageStyle = {
      width:this.props.size,
      height:this.props.size,
      maxWidth:this.props.size,
      maxHeight:this.props.size,
      position:'absolute',
      left:0,
      top:0,
    }

    let typeCount = {
      head: 2,
      hair: 3,
      nose: 2,
      mouth: 2,
      eyes: 3,
    }
    let images = {}

    for(let type in typeCount){
      images[type]= Math.floor(this.props.genes[type]/(65535/typeCount[type]))+1;
    }

    //console.log(this.props.status)

    return (
      <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="90%" style={{textAlign:'left',padding:0,marginLeft:30,height:60,borderBottom:"1px solid #777777"}}>
        <tbody>
          <tr>
            <td style={{width:"10%",verticalAlign:"bottom"}}>
              <div style={{position:"relative",marginTop:this.props.size*-1}}>
                <img style={imageStyle} src={"citizens/head_"+images['head']+".png"} />
                <img style={imageStyle} src={"citizens/hair_"+images['hair']+".png"} />
                <img style={imageStyle} src={"citizens/nose_"+images['nose']+".png"} />
                <img style={imageStyle} src={"citizens/mouth_"+images['mouth']+".png"} />
                <img style={imageStyle} src={"citizens/eyes_"+images['eyes']+".png"} />
              </div>
            </td>
            <td style={{width:"40%",verticalAlign:"bottom"}}>
              <table cellSpacing={"0"} cellPadding={"2"} border={"0"} width="100%" style={{padding:0}}>
                <tbody>
                  <tr>
                    <td>
                      #{this.props.id} <span style={{fontWeight:'bold'}}>{this.convertStatus(this.props.status,this.props.data)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{position:"relative"}}>
                        <img src="mapicon.png" style={{maxHeight:26,position:"absolute",left:-9,top:-4,zIndex:-1,opacity:0.2}}/>
                        <span style={{marginRight:15,opacity:0.7}}>location:</span> {this.props.tile} @ ({this.props.x},{this.props.y})
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
              </div>
            </td>
            <td style={{width:"50%",verticalAlign:"bottom"}}>
              <div>
                {menu}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
export default Citizen;
