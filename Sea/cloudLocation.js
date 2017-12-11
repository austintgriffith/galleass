//
// usage: clevis contract cloudLocation Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.cloudLocation(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
