//
// usage: clevis contract increaseApproval Timber ##accountindex## _spender _addedValue
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running increaseApproval("+args[4]+","+args[5]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.increaseApproval(args[4],args[5]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
