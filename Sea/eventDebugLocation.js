//
// usage: node contract DebugLocation Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('DebugLocation', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
