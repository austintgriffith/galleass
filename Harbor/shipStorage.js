//
// usage: clevis contract shipStorage Harbor
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipStorage(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
