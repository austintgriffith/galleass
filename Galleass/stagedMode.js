//
// usage: clevis contract stagedMode Galleass
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.stagedMode().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
