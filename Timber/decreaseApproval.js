//
// usage: clevis contract decreaseApproval Catfish ##accountindex## _spender _subtractedValue
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running decreaseApproval("+args[4]+","+args[5]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.decreaseApproval(args[4],args[5]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
