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
    let statsSize = "20%"
    let buttonSize = "70%"
    let stats=""
    let menu
    if(this.state.menu=="sellCitizen"){
      menu = (
        <div style={{float:"right"}}>
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
          <div style={{float:"right"}}>
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

      let chars = []
      for(let c in this.props.characteristics){
        if(c.length>=3){
          chars.push(
            <span style={{fontSize:11,padding:2}}>
              {c.substring(0,3)}:{this.props.characteristics[c]}
            </span>
          )
        }
      }
      stats = (
        <table cellSpacing={"0"} cellPadding={"2"} border={"0"} width="100%" style={{padding:0}}>
          <tbody>
            <tr>
              <td>
                #{this.props.id} <span style={{fontWeight:'bold'}}>{this.convertStatus(this.props.status,this.props.data)}</span>
              </td>
              <td style={{textAlign:'right'}}>
                {chars}
              </td>
            </tr>
            <tr>
              <td colspan={"2"} style={{textAlign:'right'}}>
                <div style={{position:"relative"}}>
                  {this.props.tile} @ ({this.props.x},{this.props.y})
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )
      statsSize = "65%"
      buttonSize = "25%"
    }




    return (
      <div style={{width:"100%",height:50}}>
        <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="90%" style={{textAlign:'left',padding:0,marginLeft:30,height:60,borderBottom:"1px solid #777777"}}>
          <tbody>
            <tr>
              <td style={{width:"10%",verticalAlign:"bottom"}}>
                <CitizenFace {...this.props}/>
              </td>
              <td style={{width:statsSize,verticalAlign:"bottom"}}>
                {stats}
              </td>
              <td style={{width:buttonSize,verticalAlign:"bottom"}}>
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
