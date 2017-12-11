//
// usage: node contract Ship Sea
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Ship', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
