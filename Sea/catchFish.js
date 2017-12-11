//
// usage: clevis contract catchFish Sea ##accountindex## fish
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running catchFish("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.catchFish(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
