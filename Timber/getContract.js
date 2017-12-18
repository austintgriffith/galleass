//
// usage: clevis contract getContract Timber
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.getContract(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
