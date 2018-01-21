import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';

const config = { stiffness: 100, damping: 7 };

class Inventory extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

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
      url = this.props.etherscan+"address/"+contractOfItem._address
    }else{
      url = "https://wallet.ethereum.org/";
    }
    window.open(url)
  }
  render(){
    let {inventory} = this.props

    let display = [];

    let sellForCopper = (item)=>{
      return (
        <img onClick={this.sellForCopper.bind(this,item)} style={{maxHeight:25,paddingRight:20,verticalAlign:'bottom'}} src={"copper_small.png"} />
      )
    }


    for(let pass in [0,1])
    for(let i in inventory){
      if((pass==0 && i=="Ether" || pass==1 && i!="Ether")&&inventory[i]>0){
        let extra = "";
        let maxWidth = 64
        let maxHeight = 32
        if(i!="Ether" && i!="Copper" && i!="Ships" ) extra = sellForCopper(i);
        if(i=="Ships") maxHeight=58

        let extraBottomMargin=0;
        if(i=="Ether") extraBottomMargin=15
        if(i=="Ships") extraBottomMargin=15
        if(i=="Copper") extraBottomMargin=15

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
                    <span style={this.props.textStyle}>{inventory[i]}</span>
                    <img style={{maxWidth:maxWidth,maxHeight:maxHeight,marginRight:value.right,verticalAlign:'bottom'}} src={i.toLowerCase()+".png"}/>
                  </span>
                </div>
              )
            }
          </Motion>
        )
      }
    }

    return (
      <div style={{float:'right',padding:2,paddingRight:10,textAlign:'right'}} >
        {display}
      </div>
    )
  }
}

export default Inventory;
