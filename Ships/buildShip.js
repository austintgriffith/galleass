//
// usage: clevis contract buildShip Ships ##accountindex## model
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running buildShip("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.buildShip(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
