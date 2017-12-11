//
// usage: clevis contract stage Sea ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running stage() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.stage().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
