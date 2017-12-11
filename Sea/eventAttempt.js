//
// usage: node contract Attempt Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Attempt', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
