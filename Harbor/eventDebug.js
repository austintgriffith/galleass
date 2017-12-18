//
// usage: node contract Debug Harbor
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Debug', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
