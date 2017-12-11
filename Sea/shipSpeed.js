//
// usage: clevis contract shipSpeed Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipSpeed().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
