//
// usage: clevis contract approve Timber ##accountindex## _spender _value
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running approve("+args[4]+","+args[5]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.approve(args[4],args[5]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
