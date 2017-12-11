//
// usage: node contract Cloud Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Cloud', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
