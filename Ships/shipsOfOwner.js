//
// usage: clevis contract shipsOfOwner Ships
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.shipsOfOwner(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
