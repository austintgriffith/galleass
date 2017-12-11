//
// usage: clevis contract scuttle Sea ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running scuttle() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.scuttle().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
