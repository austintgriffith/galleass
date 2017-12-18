//
// usage: clevis contract production Galleass ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running production() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.production().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
