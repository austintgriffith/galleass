//
// usage: node contract DropAnchor Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('DropAnchor', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
