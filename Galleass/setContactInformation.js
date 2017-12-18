//
// usage: clevis contract setContactInformation Galleass ##accountindex## info
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running setContactInformation("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.setContactInformation(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
