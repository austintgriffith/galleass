//
// usage: node contract MintFinished Timber
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('MintFinished', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
