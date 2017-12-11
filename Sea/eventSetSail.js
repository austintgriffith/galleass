//
// usage: node contract SetSail Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('SetSail', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
