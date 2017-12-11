//
// usage: clevis contract fish Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.fish(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
