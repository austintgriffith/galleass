import React, { Component } from 'react'
import {Motion, spring, presets} from 'react-motion'
import Writing from '../Writing.js'

class Transactions extends Component {
  render(){

    let transactions = []

    let largerThanZoom = Math.min(1,this.props.zoom*1.5)

    this.props.transactions.map((tx)=>{
      let shortHash = tx.hash.substring(0,6)
      let randomPlank = 1+(this.props.web3.utils.hexToNumber(shortHash)%5)
      let timePassed = Date.now()-tx.time
      let loadedPercent = Math.round(timePassed*100/this.props.avgBlockTime)/100

      let loaderImage = 24
      let loaderType = "preloader"
      if(tx.polledreceipt){
        if(tx.polledreceipt.status){
          loaderImage = 12
          loaderType = "loader"
        }else{
          loaderImage = 0
          loaderType = "failedloader"
        }
      }else{
        if(loadedPercent<=1){
          loaderImage=Math.round(loadedPercent*loaderImage)
        }
        if(loaderImage<=0) loaderImage=1;
      }


      let left = -24
      if(tx.closed){
        left = -250
      }

      let body = (
        <div>
          <div style={{position:"absolute",left:25,top:8,opacity:0.8}}>
            <img style={{maxWidth:38}} src={loaderType+"_"+loaderImage+".png"} />
          </div>
          <div style={{position:"absolute",left:62,top:4}}>
            <Writing string={shortHash} size={20}/>
          </div>
        </div>
      )


      if(tx.polledreceipt && tx.polledreceipt.status && tx.done ){


       let gasCost =   Math.round(tx.polledreceipt.gasUsed * this.props.GWEI / 1000000000 * 10000000) / 10000000

        body = (
          <div>
            <div style={{position:"absolute",left:25,top:6,opacity:0.8}}>
              <img style={{maxHeight:20,paddingRight:4}} src={"ether.png"} />
            </div>
            <div style={{position:"absolute",left:43,top:4}}>
              <Writing string={gasCost} size={20}/>
            </div>
          </div>
        )
      }

      transactions.push(
        <Motion key={tx.hash}
        defaultStyle={{
          left:-200
        }}
        style={{
          left:spring(left,{ stiffness: 80, damping: 8 })
        }}
        >
        {currentStyles => {
          let height = 80
          let fixedOffset = ((1-largerThanZoom) * height)*-1
          return (
            <div style={{transform: "scale(1.7)", transformOrigin: "left center",position:"relative",backgroundImage:"url('plank"+randomPlank+".png')",backgroundRepeat:'no-repeat',width:144,height:31,marginTop:25,left:currentStyles.left}}>
              <a href={this.props.etherscan+"tx/"+tx.hash} target='_blank'>
                {body}
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



   let height = 66*transactions.length
   let fixedOffset = ((1-largerThanZoom) * height)*-1
   let leftZoomOffset = ((1-largerThanZoom) * 59)*-1
    return (

      <div style={{transform:"scale("+largerThanZoom+")",zIndex:749,position:'fixed',left:leftZoomOffset,paddingTop:30,marginBottom:fixedOffset,textAlign:"left",bottom:100,opacity:1,height:height,width:120}}>
        {transactions}
      </div>

    )
  }
}


export default Transactions;
