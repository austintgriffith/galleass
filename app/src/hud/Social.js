import React, { Component } from 'react';

class Social extends Component {
  render(){
    let rightOffset = ((1-this.props.zoom)*50)
    let bottomOffset = ((1-this.props.zoom)*15)
    return (
      <div style={{transform:"scale("+this.props.zoom+")",zIndex:1,position:'fixed',right:20-rightOffset,bottom:-4-bottomOffset,opacity:1-this.props.cornerOpacity}}>
      <a href="https://join.slack.com/t/galleass/shared_invite/enQtMzE0MjQ5MzMyMzQzLTk3MmI2Zjk4Njc2ZmUwYzI5ZjA1ZmRiNzY4MjQ1OTM1OTM0NTM0MmZjNWVhZWEzMWI2ZTk1MzJjNDk4OTIzZmY" target="_blank">
      <img data-rh="Slack" data-rh-at="top" style={{maxHeight:36,opacity:0.7}} src="slack.png" />
      </a>
      </div>
    )
  }
}

export default Social;
