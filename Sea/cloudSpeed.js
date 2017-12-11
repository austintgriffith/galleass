//
// usage: clevis contract cloudSpeed Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.cloudSpeed(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
