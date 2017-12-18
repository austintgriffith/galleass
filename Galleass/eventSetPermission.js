//
// usage: node contract SetPermission Galleass
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('SetPermission', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
