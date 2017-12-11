//
// usage: clevis contract width Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.width().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
