//
// usage: node contract Mint Timber
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Mint', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
