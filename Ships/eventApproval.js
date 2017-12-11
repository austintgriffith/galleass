//
// usage: node contract Approval Ships
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Approval', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
