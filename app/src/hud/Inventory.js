import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import Writing from '../Writing.js'

const config = { stiffness: 100, damping: 7 };

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: 0.0
    }
  }
  sellForCopper(item){
    console.log("sellForCopperCLICK",item)
    this.props.sellFish(item)
  }
  invClick(item){
    console.log("INV",item)

    let url;
    if(item!="Ether"){
      let contractOfItem = this.props.contracts[item]
      console.log(contractOfItem)
      //url = this.props.etherscan+"address/"+contractOfItem._address
      console.log("open token send modal")
      this.props.invClick(item,contractOfItem)
    }else{
      //url = "https://wallet.ethereum.org/";
      //window.open(url)
      console.log("open eth wallet modal")
      this.props.invClick(item)
    }

  }
  render(){
    let {inventory} = this.props

    let display = [];

    /*let sellForCopper = (item)=>{
      return (
        <img onClick={this.sellForCopper.bind(this,item)} style={{maxHeight:25,paddingRight:20}} src={"copper_small.png"} />
      )
    }*/


    for(let pass in [0,1])
    for(let i in inventory){
      if((pass==0 && i=="Ether" || pass==1 && i!="Ether")&&inventory[i]>0){
        let extra = "";
        let maxWidth = 40
        let maxHeight = 40
        //if(i=="Snark" || i=="Pinner" || i=="Dangler" || i=="Redbass" || i=="Catfish") extra = sellForCopper(i);
        if(i=="Dogger") maxHeight=40

        let extraBottomMargin=0;
        //if(i=="Ether") extraBottomMargin=15
        //if(i=="Dogger") extraBottomMargin=15
        //if(i=="Copper") extraBottomMargin=15

        display.push(
          <Motion
             key={"inventory"+i}
             defaultStyle={{ right: -50 }}
             style={{ right: spring(5, config) }}
          >
            {
              (value) => (
                <div style={{padding:5,marginBottom:extraBottomMargin}}>
                  <span style={{cursor:'pointer'}}>{extra}</span>
                  <span style={{cursor:'pointer'}} onClick={this.invClick.bind(this,i)}>
                    <Writing string={inventory[i]} size={36}/>
                    <img style={{maxWidth:maxWidth,maxHeight:maxHeight,marginLeft:15,marginRight:value.right}} src={i.toLowerCase()+".png"}/>
                  </span>
                </div>
              )
            }
          </Motion>
        )
      }
    }

    return (
      <Motion
         defaultStyle={{ opacity: 0 }}
         style={{ opacity: spring(this.state.bg, { stiffness: 60, damping: 6 }) }}
      >
        {
          (currentStyles) => (
            <div style={{float:'right',position:'relative',padding:8,paddingRight:30,marginTop:40,marginRight:-20,textAlign:'right'}} onMouseOver={()=>{this.setState({bg:0.25})}} onMouseOut={()=>{this.setState({bg:0.0})}} >
              {display}
              <div style={{zIndex:-10,position:'absolute',left:0,top:0,width:"100%",height:"100%",background:"#fee6c4",opacity:currentStyles.opacity}}></div>
            </div>
          )
        }
      </Motion>
    )
  }
}

export default Inventory;
