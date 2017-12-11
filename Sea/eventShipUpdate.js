//
// usage: node contract ShipUpdate Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('ShipUpdate', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
