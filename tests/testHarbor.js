const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
// galleass.compile("Harbor")
galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildDogger","true")
galleass.setPermission("Harbor",0,"updateExperience","true")
galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
//
//10 @ (36786,12204)
galleass.setContractOfTile(0,36786,12204,10,"Harbor")
galleass.setPriceOfFirstTileOfType(0,100,91)//set price to something weird like 91
galleass.setShipPrice(0,"Dogger","0.001")
galleass.testMint("Timber",0,0,10)
galleass.approveContract("Timber",0,"Harbor",10)
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")
// galleass.buildShip(0,"Dogger")

// galleass.setPriceOfFirstTileOfType(0,102,9)
