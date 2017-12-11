//
// usage: node contract Birth Ships
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Birth', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
