//
// usage: clevis contract Sea Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.Sea().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
