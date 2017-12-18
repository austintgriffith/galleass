//
// usage: clevis contract sellShip Harbor ##accountindex## model
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running sellShip("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.sellShip(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
