//
// usage: clevis contract reclaimEther Catfish ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running reclaimEther() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.reclaimEther().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
