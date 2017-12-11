//
// usage: clevis contract transferFrom Catfish ##accountindex## _from _to _value
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running transferFrom("+args[4]+","+args[5]+","+args[6]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.transferFrom(args[4],args[5],args[6]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
