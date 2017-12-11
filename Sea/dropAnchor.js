//
// usage: clevis contract dropAnchor Sea ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running dropAnchor() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.dropAnchor().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
