//
// usage: clevis contract depth Sea
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.depth().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}
