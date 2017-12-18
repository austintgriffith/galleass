//
// usage: clevis contract isRaw Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.isRaw(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
