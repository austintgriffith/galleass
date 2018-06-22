const galleass = require("./galleass.js")


//---------------- vvvvv ----------------- happens in deploy ------- //
// galleass.compile("Fishmonger")
// galleass.deploy("Fishmonger",0)
// galleass.setContract("Fishmonger",0)
// galleass.setPermission("Fishmonger",0,"transferFish","true")
// galleass.setPermission("Fishmonger",0,"mintFillet","true")
// galleass.setPermission("Fishmonger",0,"updateExperience","true")

// galleass.setContractOfFirstTileOfType(0,101,galleass.localContractAddress("Fishmonger"))

// galleass.setFishPrice(0,"Pinner",1)
// galleass.setFishPrice(0,"Redbass",2)
// galleass.setFishPrice(0,"Catfish",3)
// galleass.setFishPrice(0,"Snark",5)
// galleass.setFishPrice(0,"Dangler",7)

// galleass.testMint("Copper",0,1,10000)
// galleass.approveContract("Copper",1,"Fishmonger",10000)
// galleass.transferTokens("Copper",1,"Fishmonger",10000)
//
// galleass.publish()
// galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //

galleass.testMint("Catfish",0,1,10)//mint 10 Catfish to account 1
galleass.sellFish(1,"Catfish",10)//sell and butcher 10 catfish to produce 10 fillets at the fish monger

galleass.testMint("Copper",0,1,100)//mint 100 copper to account 1
galleass.transferAndCall("Copper",1,"Fishmonger",6,"0x01")//account 1 sends 6 copper to the fishmonger to buy (Action 0x01) (2) fillets (assuming price is still 3?)
