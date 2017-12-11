//
// usage: clevis contract embark Sea ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running embark() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.embark().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
