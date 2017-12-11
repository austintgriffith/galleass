//
// usage: clevis contract allowance Catfish
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.allowance(args[3],args[4]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
