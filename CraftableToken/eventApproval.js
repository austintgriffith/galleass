//
// usage: node contract Approval CraftableToken
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Approval', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
