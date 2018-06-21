import React, { Component } from 'react';
import Writing from '../Writing.js'
//import BuySellItem from './BuySellItem.js'
class ResourceTable extends Component {
  async componentDidMount(){
    let blockHashes = []
    for(let b=0;b<9;b++){
      let blocknumber = this.props.blockNumber-b;
      if(blocknumber>0){
        let block = await this.props.web3.eth.getBlock(blocknumber)
        blockHashes.push(block.hash.substring(0,6))
      }
    }

    this.setState({blockHashes:blockHashes})
  }
  render(){
    console.log(this.props)

    let blocks = ""
    if(this.state && this.state.blockHashes){
      blocks = this.state.blockHashes.map((hash)=>{
        return (
          <div>
            <Writing string={hash} size={22}/>
          </div>
        )
      })
    }


    return (
      <div style={{marginTop:20}}>


        <div style={{position:"absolute",left:130,top:105,cursor:"pointer"}} onClick={this.props.collect} data-rh="Collect Timber" data-rh-at="bottom" >
          <img style={{maxHeight:50,maxWidth:50}} src={"collect"+this.props.resourceType[0].toUpperCase()+this.props.resourceType.substring(1)+".png"} />
        </div>

        <div style={{position:"absolute",left:190,top:105,cursor:"pointer"}} onClick={this.props.extractRawResource} data-rh="Spend 3 Copper for 1 Timber" data-rh-at="bottom" >
          <img style={{maxHeight:50,maxWidth:50}} src={"extractRaw"+this.props.resourceType[0].toUpperCase()+this.props.resourceType.substring(1)+".png"} />
        </div>


        <Writing string={"Mined blocks between "+this.props.resourceMin+" and "+this.props.resourceMax+" produce "} size={24}/>
        <img style={{maxHeight:24,maxWidth:24}} src={this.props.resourceType+".png"} /><Writing string={this.props.resourceType} size={24}/>

        <div style={{marginTop:20}}>
          <Writing string={"-- Recent Blocks Hashes --"} size={16}/>
          {blocks}
        </div>
      </div>
    )
  }
}


export default ResourceTable;
