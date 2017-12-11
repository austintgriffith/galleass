//
// usage: clevis contract setSail Sea ##accountindex## direction
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running setSail("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.setSail((args[4]==="true")).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
