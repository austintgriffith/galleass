//
// usage: clevis contract tokenIndexToCrafted Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokenIndexToCrafted(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
