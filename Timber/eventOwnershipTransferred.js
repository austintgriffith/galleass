//
// usage: node contract OwnershipTransferred Timber
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('OwnershipTransferred', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
