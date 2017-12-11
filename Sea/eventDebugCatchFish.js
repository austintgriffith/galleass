//
// usage: node contract DebugCatchFish Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('DebugCatchFish', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
