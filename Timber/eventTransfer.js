//
// usage: node contract Transfer Catfish
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Transfer', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
