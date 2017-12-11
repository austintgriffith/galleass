//
// usage: node contract Stock Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Stock', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
