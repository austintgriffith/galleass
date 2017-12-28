import React, { Component } from 'react';

class Inventory extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  render(){
    let {inventory} = this.props

    let display = [];

    let iconStyle = {
      zIndex:210,
      maxWidth:50,
      maxHeight:50,
      verticalAlign:'middle',
      padding:4,
      paddingLeft:10
    }

    let textStyle = {
      zIndex:210,
      fontWeight:'bold',
      fontSize:20,
      verticalAlign:'middle',
      color:"#dddddd",
      textShadow: "-1px 0 #777777, 0 1px #777777, 1px 0 #777777, 0 -1px #777777"
    }

    for(let i in inventory){
      //console.log(inventory[i],i)
      if(inventory[i]>0){
        display.push(
          <div>
            <span style={textStyle}>{inventory[i]}</span><img style={iconStyle} src={i+".png"}/>
          </div>
        )
      }
    }

    return (
      <div style={{float:'right',padding:2}}>
        {display}
      </div>
    )
  }
}

export default Inventory;
