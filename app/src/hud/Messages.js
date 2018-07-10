import React, { Component } from 'react'
import {Motion, spring, presets} from 'react-motion'
import Writing from '../Writing.js'

class Messages extends Component {
  render(){

    let messages = []

    let largerThanZoom = Math.min(1,this.props.zoom*1.5)

    this.props.messages.map((msg)=>{

      let left = 15
      if(msg.read){
        left = -150
      }

      messages.push(
        <Motion key={msg.id}
        defaultStyle={{
          left:-150
        }}
        style={{
          left:spring(left,{ stiffness: 120, damping: 5 })
        }}
        >
        {currentStyles => {
          let height = 50
          let fixedOffset = ((1-largerThanZoom) * height)*-1
          return (
            <div
              style={{
                position:"relative",
                backgroundImage:"url('message.png')",
                backgroundRepeat:'no-repeat',
                width:96,height:77,
                marginTop:5,
                left:currentStyles.left,
                cursor:"pointer"
              }}
              onClick={()=>{
                this.props.openModal({
                  message:msg.data
                })
                setTimeout(()=>{
                  this.props.updateMessages([
                    {
                      id:'introfromfishmonger',
                      read:true
                    }
                  ])
                },3000)
              }}
            >
            </div>
          )
        }}
        </Motion>
      )
    })


   let height = 36*messages.length
   let fixedOffset = ((1-largerThanZoom) * height)*-1
   let leftZoomOffset = ((1-largerThanZoom) * 59)*-1
    return (

      <div style={{transform:"scale("+largerThanZoom+")",zIndex:749,position:'fixed',left:leftZoomOffset,paddingTop:30,marginBottom:fixedOffset,textAlign:"left",top:124,opacity:1,height:height,width:120}}>
        {messages}
      </div>

    )
  }
}


export default Messages;
