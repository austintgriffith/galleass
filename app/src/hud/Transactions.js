import React, { Component } from 'react'
import {Motion, spring, presets} from 'react-motion'
import Writing from '../Writing.js'

class Transactions extends Component {
  render(){

    let transactions = []

    this.props.transactions.map((tx)=>{
      let shortHash = tx.hash.substring(0,6)
      let timePassed = Date.now()-tx.time
      let loadedPercent = Math.round(timePassed*100/this.props.avgBlockTime)/100

      let loaderImage = 24
      let loaderType = "preloader"
      if(tx.receipt){
        loaderImage = 12
        loaderType = "loader"
      }
      if(loadedPercent<=1){
        loaderImage=Math.round(loadedPercent*loaderImage)
      }
      if(loaderImage<=0) loaderImage=1;

      let left = -24
      if(tx.confirmations){
        left = -150
        loaderImage = 12
        loaderType = "loader"
      }

      transactions.push(
        <Motion key={tx.hash}
        defaultStyle={{
          left:-150
        }}
        style={{
          left:spring(left,{ stiffness: 80, damping: 8 })
        }}
        >
        {currentStyles => {
          let height = 50
          let fixedOffset = ((1-this.props.zoom) * height)*-1
          return (
            <div style={{position:"relative",backgroundImage:"url('plank2.png')",backgroundRepeat:'no-repeat',width:144,height:31,marginTop:5,left:currentStyles.left}}>
              <a href={this.props.etherscan+"tx/"+tx.hash} target='_blank'>
                <div style={{position:"absolute",left:25,top:8,opacity:0.8}}>
                  <img style={{maxWidth:38}} src={loaderType+"_"+loaderImage+".png"} />
                </div>
                <div style={{position:"absolute",left:62,top:4}}>
                  <Writing string={shortHash} size={20}/>
                </div>
              </a>
            </div>
          )
        }}
        </Motion>
      )
    })



    /*

        <div style={{transform:"scale("+this.props.zoom+")",zIndex:760,position:'fixed',left:this.props.clientWidth/2-400,paddingTop:30,marginBottom:fixedOffset,textAlign:"center",bottom:currentStyles.bottom,opacity:1,backgroundImage:"url('bottomBar.png')",backgroundRepeat:'no-repeat',height:height,width:800}}>
        <Writing style={{opacity:0.9}} string={this.props.bottomBarMessage} size={this.props.bottomBarSize}/>
        </div>
      )
    }}
    </Motion>

    */
   let height = 36*transactions.length
   let fixedOffset = ((1-this.props.zoom) * height)*-1
    return (

      <div style={{transform:"scale("+this.props.zoom+")",zIndex:780,position:'fixed',left:0,paddingTop:30,marginBottom:fixedOffset,textAlign:"left",bottom:100,opacity:1,height:height,width:120}}>
        {transactions}
      </div>

    )
  }
}


export default Transactions;
