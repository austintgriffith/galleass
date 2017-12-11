//
// usage: clevis contract allowSpecies Sea ##accountindex## _species
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running allowSpecies("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.allowSpecies(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
