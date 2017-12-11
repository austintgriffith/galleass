//
// usage: clevis contract pause Sea ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running pause() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.pause().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
