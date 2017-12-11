//
// usage: clevis contract shipIndexToApproved Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipIndexToApproved(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
