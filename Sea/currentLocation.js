//
// usage: clevis contract currentLocation Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.currentLocation(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
