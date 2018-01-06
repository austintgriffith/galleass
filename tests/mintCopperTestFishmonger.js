const galleass = require("./galleass.js")

// galleass.compile("Fishmonger")
//
//
// galleass.deploy("Fishmonger",0)
// galleass.setContract("Fishmonger",0)
// galleass.setPermission("Fishmonger",0,"transferFish","true")
// galleass.setPermission("Fishmonger",0,"mintFillet","true")


//give account 1 a couple catfish
galleass.testMint("Catfish",0,1,2)

//give the fishmonger a bunch of copper
galleass.testMint("Copper",0,1,100)
galleass.approveContract("Copper",1,"Fishmonger",100)
galleass.transferTokens("Copper",1,"Fishmonger",100)

galleass.setFishPrice(0,"Catfish",2)


galleass.sellFish(1,"Catfish",2)
