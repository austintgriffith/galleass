//
// usage: clevis contract ingredients Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.ingredients(args[3],args[4]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
