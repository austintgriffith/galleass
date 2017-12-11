//
// usage: node contract Debug Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Debug', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
