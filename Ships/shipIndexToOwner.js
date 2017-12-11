//
// usage: clevis contract shipIndexToOwner Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipIndexToOwner(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
