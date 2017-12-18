//
// usage: clevis contract finishMinting Timber ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running finishMinting() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.finishMinting().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
