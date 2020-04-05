import React, { Component } from 'react';
import Writing from '../Writing.js'
import BuySellTable from './BuySellTable.js'
import SendToTile from './SendToTile.js'
import BuySellOwner from './BuySellOwner.js'

class Market extends Component {
  async setSellPrice(x,y,tile,tokenAddress,price){
    let {web3,readContracts,contracts,GWEI} = this.props
    console.log("setSellPrice",x,y,tile,tokenAddress,price)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    //setSellPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price
    console.log("setSellPrice.....")
    contracts["Market"].methods.setSellPrice(x,y,tile,tokenAddress,price).send({
      from: accounts[0],
      gas:250000,
      gasPrice:Math.round(GWEI * 1000000000)
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.props.startWaiting(hash)
    }).on('error',this.props.transactionError)
    .on('transactionHash',this.props.transactionHash)
    .on('receipt',this.props.transactionReceipt)
    .on('confirmation', this.props.transactionConfirmation).then((receipt)=>{
      console.log("RESULT:",receipt)
    })
  }
  async setBuyPrice(x,y,tile,tokenAddress,price){
    let {web3,contracts,GWEI} = this.props
    console.log("setBuyPrice",x,y,tile,tokenAddress,price)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    //setSellPrice(uint16 _x,uint16 _y,uint8 _tile,address _token,uint _price
    console.log("setBuyPrice.....")
    contracts["Market"].methods.setBuyPrice(x,y,tile,tokenAddress,price).send({
      from: accounts[0],
      gas:250000,
      gasPrice:Math.round(GWEI * 1000000000)
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.props.startWaiting(hash)
    }).on('error',this.props.transactionError)
    .on('transactionHash',this.props.transactionHash)
    .on('receipt',this.props.transactionReceipt)
    .on('confirmation', this.props.transactionConfirmation).then((receipt)=>{
      console.log("RESULT:",receipt)
    })
  }
  async buyFromMarket(x,y,i,tokenName,copperToSpend){
    let {web3,contracts,GWEI} = this.props
    console.log("buyFromMarket",x,y,i,tokenName,copperToSpend)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    let xHex = parseInt(x).toString(16)
    while(xHex.length<4) xHex="0"+xHex;
    let yHex = parseInt(y).toString(16)
    while(yHex.length<4) yHex="0"+yHex;
    let iHex = parseInt(i).toString(16)
    while(iHex.length<2) iHex="0"+iHex;
    let addressHex = contracts[tokenName]._address

    addressHex = addressHex.replace("0x","")
    if(addressHex.length%2==1){
      addressHex="0"+addressHex;
    }
    console.log("addressHex",addressHex)

    let amountOfCopper = copperToSpend
    let action = "0x01"
    let finalHex = action+xHex+yHex+iHex+addressHex
    console.log("%%%%%%%%%%%%%%%%% Buy "+tokenName+" at the market  x:"+xHex+" y:"+yHex+" i:"+iHex+" for "+amountOfCopper+" copper with finalHex: "+finalHex)
    contracts["Copper"].methods.transferAndCall(contracts["Market"]._address,amountOfCopper,finalHex).send({
      from: accounts[0],
      gas:500000,
      gasPrice:Math.round(GWEI * 1000000000)
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.props.startWaiting(hash)
    }).on('error',this.props.transactionError)
    .on('transactionHash',this.props.transactionHash)
    .on('receipt',this.props.transactionReceipt)
    .on('confirmation', this.props.transactionConfirmation).then((receipt)=>{
      console.log("RESULT:",receipt)
    })
  }
  async sellToMarket(x,y,i,tokenName,amountOfTokenToSend){
    let {web3,contracts,GWEI} = this.props
    console.log("SELL TO MARKET",x,y,i,tokenName,amountOfTokenToSend)
    const accounts = await promisify(cb => web3.eth.getAccounts(cb));
    let xHex = parseInt(x).toString(16)
    while(xHex.length<4) xHex="0"+xHex;
    let yHex = parseInt(y).toString(16)
    while(yHex.length<4) yHex="0"+yHex;
    let iHex = parseInt(i).toString(16)
    while(iHex.length<2) iHex="0"+iHex;

    let action = "0x02"
    let finalHex = action+xHex+yHex+iHex
    console.log("Trying to sill "+amountOfTokenToSend+" "+tokenName+" to market at  x:"+xHex+" y:"+yHex+" i:"+iHex+" with finalHex: "+finalHex)
    contracts[tokenName].methods.transferAndCall(contracts["Market"]._address,amountOfTokenToSend,finalHex).send({
      from: accounts[0],
      gas:500000,
      gasPrice:Math.round(GWEI * 1000000000)
    },(error,hash)=>{
      console.log("CALLBACK!",error,hash)
      this.props.startWaiting(hash)
    }).on('error',this.props.transactionError)
    .on('transactionHash',this.props.transactionHash)
    .on('receipt',this.props.transactionReceipt)
    .on('confirmation', this.props.transactionConfirmation).then((receipt)=>{
      console.log("RESULT:",receipt)
    })
  }
  render(){

    let content = []

    let buyArray = []
    let sellArray = []

    let {inventoryTokens,ownsTile,landX,landY,sellPrices,buyPrices,timberBalance,index} = this.props

    for(let i in inventoryTokens){
      if(sellPrices[inventoryTokens[i]]>0){
        buyArray.push(
          {
            amount: "1",
            balance: timberBalance,
            first:inventoryTokens[i]/*.toLowerCase()*/,
            price: sellPrices[inventoryTokens[i]],
            second:"copper",
            //buyFromMarket(x,y,i,tokenName,copperToSpend)
            clickFn: this.buyFromMarket.bind(this,landX,landY,index,inventoryTokens[i],sellPrices[inventoryTokens[i]])
          }
        )
      }
      if(buyPrices[inventoryTokens[i]]){
        sellArray.push(
          {
            amount:"1",
            balance:false,
            first:inventoryTokens[i],
            price:buyPrices[inventoryTokens[i]],
            second:"copper",
            clickFn: this.sellToMarket.bind(this,landX,landY,index,inventoryTokens[i],1,buyPrices[inventoryTokens[i]]),
          }
        )
      }
    }
    content.push(
      <BuySellTable buyArray={buyArray} sellArray={sellArray}/>
    )
    content.push(
      <SendToTile {...this.props} sendToTile={(contractName,amount,tokenName)=>{
        this.props.transferAndCall(landX,landY,index,contractName,amount,tokenName);
      }}/>
    )
    if(ownsTile){
      content.push(
        <BuySellOwner
          setSellPrice={this.setSellPrice.bind(this)}
          setBuyPrice={this.setBuyPrice.bind(this)}
          {...this.props}
        />
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


export default Market;
