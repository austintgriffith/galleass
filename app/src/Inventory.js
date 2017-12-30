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

    let textStyle = {
      zIndex:210,
      fontWeight:'bold',
      fontSize:42,
      paddingRight:10,
      color:"#dddddd",
      textShadow: "-1px 0 #777777, 0 1px #777777, 1px 0 #777777, 0 -1px #777777"
    }
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
                <div>
                  <span style={textStyle}>{inventory[i]}</span>
                  <img style={{maxWidth:64,maxHeight:32,marginRight:value.right}} src={i+".png"}/>
                </div>
              )
            }
          </Motion>
        )
      }
    }

    return (
      <div style={{float:'right',padding:2,textAlign:'right'}} onClick={this.click.bind(this)}>
        {display}
      </div>
    )
  }
}

export default Inventory;
