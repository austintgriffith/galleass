const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
galleass.compile("Harbor")
galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildDogger","true")
galleass.setPermission("Harbor",0,"buildSchooner","true")
galleass.setPermission("Harbor",0,"updateExperience","true")
galleass.publish()
galleass.reload()
// // //---------------- ^^^^^ ----------------- happens in deploy ------- //
// //
//10 @ (23575,27237)
galleass.setContractOfTile(0,23575,27237,10,"Harbor")
galleass.setPriceOfFirstTileOfType(0,100,91)//set price to something weird like 91
// galleass.setShipPrice(0,"Dogger","0.001")
// galleass.testMint("Timber",0,0,10)
// galleass.approveContract("Timber",0,"Harbor",10)
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")

// galleass.setPriceOfFirstTileOfType(0,102,9)



//attempt to buy harbor back from current ropsten depoyment
//galleass.transferAndCall("Copper",0,"Fishmonger",100,"0x00")
//galleass.transferAndCall("Copper",0,"LandLib",99,"0x01")
// galleass.buyLand(0,99,"Harbor")
