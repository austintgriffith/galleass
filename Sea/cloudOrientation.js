//
// usage: clevis contract cloudOrientation Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.cloudOrientation(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
