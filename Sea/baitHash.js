//
// usage: clevis contract baitHash Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.baitHash(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
