//
// usage: clevis contract mode Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.mode().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
