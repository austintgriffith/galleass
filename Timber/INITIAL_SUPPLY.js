//
// usage: clevis contract INITIAL_SUPPLY Catfish
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.INITIAL_SUPPLY().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
