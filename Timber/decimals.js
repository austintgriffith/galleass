//
// usage: clevis contract decimals Catfish
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.decimals().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
