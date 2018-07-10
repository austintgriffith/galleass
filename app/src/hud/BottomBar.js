import React, { Component } from 'react'
import {Motion, spring, presets} from 'react-motion'
import Writing from '../Writing.js'

class BottomBar extends Component {
  render(){
    return (
      <Motion
      defaultStyle={{
        bottom:-100
      }}
      style={{
        bottom:spring(this.props.bottomBar,{ stiffness: 100, damping: 7 })
      }}
      >
      {currentStyles => {
        let height = 50
        let fixedOffset = ((1-this.props.zoom) * height)*-1
        let bottomOffset = ((1-this.props.zoom) * 10)
        return (
          <div style={{transform:"scale("+this.props.zoom+")",zIndex:760,position:'fixed',left:this.props.clientWidth/2-400,paddingTop:30,marginBottom:fixedOffset,textAlign:"center",bottom:currentStyles.bottom+bottomOffset,opacity:1,backgroundImage:"url('bottomBar.png')",backgroundRepeat:'no-repeat',height:height,width:800}}>
          <Writing style={{opacity:0.9}} string={this.props.bottomBarMessage} size={this.props.bottomBarSize}/>
          </div>
        )
      }}
      </Motion>
    )
  }
}


export default BottomBar;
