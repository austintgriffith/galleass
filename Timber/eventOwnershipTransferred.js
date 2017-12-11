//
// usage: node contract OwnershipTransferred Catfish
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('OwnershipTransferred', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
