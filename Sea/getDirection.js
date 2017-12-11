//
// usage: clevis contract getDirection Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.getDirection(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
