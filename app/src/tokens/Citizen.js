import React, { Component } from 'react';

import CitizenFace from './CitizenFace.js'

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
    }else if(statusInt==150){
      return "lumberjack"
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
    }else if(this.state.menu=="moveCitizen"){
        menu = (
          <div>
            <img src="exit.png" style={{cursor:"pointer",maxHeight:28,marginRight:5,verticalAlign:'middle'}} onClick={()=>{
              this.setState({menu:false})
            }}/>
            Move to tile:
            <input style={{width:30,padding:5,border:'2px solid #ccc',borderRadius:5,marginLeft:4}}
              type="text" value={this.state.moveTile} onFocus={this.handleFocus}
              onChange={this.handleInput.bind(this,"moveTile")}
            />
            <img src="metamasksign.png" style={{cursor:"pointer",maxHeight:28,marginLeft:5,verticalAlign:'middle'}} onClick={()=>{
              if(this.state.moveTile){
                this.props.moveCitizen(this.props.id,this.state.moveTile)
              }
            }}/>
          </div>
        )
    }else{
      menu = (
        <div>
          <img src="sellCitizen.png" style={{cursor:"pointer",maxHeight:40,marginBottom:-5,marginLeft:5}} onClick={()=>{
            this.setState({menu:"sellCitizen"})
          }}/>
          <img src="moveCitizen.png" style={{cursor:"pointer",maxHeight:40,marginBottom:-5,marginLeft:5}} onClick={()=>{
            this.setState({menu:"moveCitizen"})
          }}/>
        </div>
      )
    }

    //,overflowX:"scroll"

    return (
      <div style={{width:"100%",height:50}}>
        <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="90%" style={{textAlign:'left',padding:0,marginLeft:30,height:60,borderBottom:"1px solid #777777"}}>
          <tbody>
            <tr>
              <td style={{width:"10%",verticalAlign:"bottom"}}>
                <CitizenFace {...this.props}/>
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
      </div>
    )
  }
}
export default Citizen;
