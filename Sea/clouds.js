//
// usage: clevis contract clouds Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.clouds().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
