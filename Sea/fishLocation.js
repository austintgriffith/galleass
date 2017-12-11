//
// usage: clevis contract fishLocation Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.fishLocation(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
