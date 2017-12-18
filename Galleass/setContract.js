//
// usage: clevis contract setContract Galleass ##accountindex## _name _contract
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running setContract("+args[4]+","+args[5]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.setContract(args[4],args[5]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
