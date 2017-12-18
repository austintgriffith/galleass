//
// usage: node contract SetContract Galleass
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('SetContract', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
