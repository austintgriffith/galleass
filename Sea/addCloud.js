//
// usage: clevis contract addCloud Sea ##accountindex## _location _speed _image
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running addCloud("+args[4]+","+args[5]+","+args[6]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.addCloud(args[4],args[5],args[6]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
