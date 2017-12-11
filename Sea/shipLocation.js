//
// usage: clevis contract shipLocation Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipLocation(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
