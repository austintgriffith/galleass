import React, { Component } from 'react';

class Dogger extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render(){
    return (
      <div style={{width:"100%",height:50}}>
        <table cellSpacing={"0"} cellPadding={"5"} border={"0"} width="90%" style={{textAlign:'left',padding:0,marginLeft:30,height:60,borderBottom:"1px solid #777777"}}>
          <tbody>
            <tr>
              <td style={{width:"10%",verticalAlign:"bottom"}}>
                <img style={{maxHeight:40,marginBottom:-8}} src="dogger.png" />
              </td>
              <td style={{width:"40%",verticalAlign:"bottom"}}>
               strength:{this.props.strength}  speed:{this.props.speed} luck:{this.props.luck}
              </td>
              <td style={{width:"50%",verticalAlign:"bottom"}}>
              <img src="approveAndEmbark.png" style={{cursor:"pointer",maxHeight:40,marginBottom:-5,marginLeft:5}} onClick={()=>{
                this.props.embark(this.props.id)
              }}/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
export default Dogger;
