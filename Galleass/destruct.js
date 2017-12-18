//
// usage: clevis contract destruct Galleass ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running destruct() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.destruct().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
