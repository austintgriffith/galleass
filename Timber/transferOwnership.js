//
// usage: clevis contract transferOwnership Catfish ##accountindex## newOwner
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running transferOwnership("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.transferOwnership(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
