//
// usage: clevis contract species Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.species(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
