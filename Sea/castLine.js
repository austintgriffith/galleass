//
// usage: clevis contract castLine Sea ##accountindex## baitHash
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running castLine("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.castLine(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
