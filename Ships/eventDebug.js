//
// usage: node contract Debug Ships
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Debug', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
