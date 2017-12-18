//
// usage: clevis contract tokenIndexToOwner CraftableToken
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokenIndexToOwner(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
