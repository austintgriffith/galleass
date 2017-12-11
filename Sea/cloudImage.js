//
// usage: clevis contract cloudImage Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.cloudImage(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
