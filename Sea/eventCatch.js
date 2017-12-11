//
// usage: node contract Catch Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Catch', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
