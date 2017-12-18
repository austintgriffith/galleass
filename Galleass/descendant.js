//
// usage: clevis contract descendant Galleass
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.descendant().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
