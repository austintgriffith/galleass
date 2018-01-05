import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';

const config = { stiffness: 100, damping: 7 };

class Inventory extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  click(){
    console.log("CLICK")

  }
  render(){
    let {inventory} = this.props

    let display = [];

    for(let pass in [0,1])
    for(let i in inventory){
      if((pass==0 && i=="Ether" || pass==1 && i!="Ether")&&inventory[i]>0){
        display.push(
          <Motion
             key={"inventory"+i}
             defaultStyle={{ right: -50 }}
             style={{ right: spring(5, config) }}
          >
            {
              (value) => (
                <div style={{padding:5}}>
                  <span style={this.props.textStyle}>{inventory[i]}</span>
                  <img style={{maxWidth:64,maxHeight:32,marginRight:value.right,verticalAlign:'bottom'}} src={i+".png"}/>
                </div>
              )
            }
          </Motion>
        )
      }
    }

    return (
      <div style={{float:'right',padding:2,paddingRight:10,textAlign:'right'}} onClick={this.click.bind(this)}>
        {display}
      </div>
    )
  }
}

export default Inventory;
