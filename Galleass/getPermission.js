//
// usage: clevis contract getPermission Galleass
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.getPermission(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
