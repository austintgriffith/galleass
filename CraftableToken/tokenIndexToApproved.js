//
// usage: clevis contract tokenIndexToApproved CraftableToken
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokenIndexToApproved(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
