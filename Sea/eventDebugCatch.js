//
// usage: node contract DebugCatch Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('DebugCatch', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
