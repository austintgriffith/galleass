//
// usage: clevis contract setDescendant Galleass ##accountindex## _descendant
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running setDescendant("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.setDescendant(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
