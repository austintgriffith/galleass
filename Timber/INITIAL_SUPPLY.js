//
// usage: clevis contract INITIAL_SUPPLY Timber
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.INITIAL_SUPPLY().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
