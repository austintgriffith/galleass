//
// usage: clevis contract mintingFinished Timber
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.mintingFinished().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
