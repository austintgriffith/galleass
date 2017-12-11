//
// usage: clevis contract shipOfOwner Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipOfOwner(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
