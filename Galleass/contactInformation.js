//
// usage: clevis contract contactInformation Galleass
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.contactInformation().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
