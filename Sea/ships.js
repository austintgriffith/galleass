//
// usage: clevis contract ships Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.ships(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
