const galleass = require("./galleass.js")

// galleass.compile("Fishmonger")
//
//
// galleass.deploy("Fishmonger",0)
// galleass.setContract("Fishmonger",0)
// galleass.setPermission("Fishmonger",0,"transferFish","true")
// galleass.setPermission("Fishmonger",0,"mintFillet","true")


galleass.setFishPrice(0,"Pinner",1)
galleass.setFishPrice(0,"Redbass",2)
galleass.setFishPrice(0,"Catfish",3)
galleass.setFishPrice(0,"Snark",5)
galleass.setFishPrice(0,"Dangler",7)

galleass.testMint("Copper",0,1,10000)
galleass.approveContract("Copper",1,"Fishmonger",10000)
galleass.transferTokens("Copper",1,"Fishmonger",10000)

galleass.testMint("Catfish",0,1,2)
galleass.sellFish(1,"Catfish",2)
