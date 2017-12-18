//
// usage: clevis contract owner Galleass
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.owner().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
