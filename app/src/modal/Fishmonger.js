import React, { Component } from 'react';
import Writing from '../Writing.js'
import BuySellTable from './BuySellTable.js'
import SendToTile from './SendToTile.js'
import BuySellOwner from './BuySellOwner.js'

class Fishmonger extends Component {
  async buyFillet(x,y,i){
    let {web3,contracts,GWEI} = this.props
    console.log("BUY FILLET ",x,y,i)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    let buyAmount = 1
    let filletPrice = await contracts["Fishmonger"].methods.filletPrice(x,y,i).call()
    console.log("Fishmonger charges ",filletPrice," for fillets")

    let xHex = parseInt(x).toString(16)
    while(xHex.length<4) xHex="0"+xHex;
    let yHex = parseInt(y).toString(16)
    while(yHex.length<4) yHex="0"+yHex;
    let iHex = parseInt(i).toString(16)
    while(iHex.length<2) iHex="0"+iHex;

    let data = "0x01"+xHex+yHex+iHex
    console.log("Final data:",data)

    contracts["Copper"].methods.transferAndCall(contracts["Fishmonger"]._address,filletPrice*buyAmount,data).send({
      from: accounts[0],
      gas:120000,
      gasPrice:Math.round(GWEI * 1000000000)
    }).on('error',this.props.transactionError)
    .on('transactionHash',this.props.transactionHash)
    .on('receipt',this.props.transactionReceipt)
    .on('confirmation', this.props.transactionConfirmation).then((receipt)=>{
      console.log("RESULT:",receipt)
    })
  }
  render(){

    let content = []

    let {inventoryTokens,ownsTile,landX,landY,index,prices,filletBalance,filletPrice,fish,sellFish} = this.props

    let buyArray = [{
      amount: "1",
      balance: filletBalance,
      first:"fillet",
      price: filletPrice,
      second:"copper",
      clickFn: this.buyFillet.bind(this,landX,landY,index),
    }]
    let sellArray = []
    for(let f in fish){
      sellArray[f] = {
        amount:"1",
        balance:false,
        first:fish[f],
        price:prices[fish[f]],
        second:"copper",
        clickFn: sellFish.bind(this,landX,landY,index,fish[f],1),
      }
    }
    content.push(
      <BuySellTable buyArray={buyArray} sellArray={sellArray}/>
    )
    if(ownsTile){
      content.push(
        <SendToTile {...this.props} sendToTile={(contractName,amount,tokenName)=>{
          this.props.transferAndCall(landX,landY,index,contractName,amount,tokenName);
        }}/>
      )
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}



const promisify = (inner) =>
new Promise((resolve, reject) =>
inner((err, res) => {
  if (err) { reject(err) }
  resolve(res);
})
);


export default Fishmonger;
