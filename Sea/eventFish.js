//
// usage: node contract Fish Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Fish', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
