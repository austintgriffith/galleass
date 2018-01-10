const galleass = require("./galleass.js")

// galleass.compile("Fishmonger")
//
//
// galleass.deploy("Fishmonger",0)
// galleass.setContract("Fishmonger",0)
// galleass.setPermission("Fishmonger",0,"transferFish","true")
// galleass.setPermission("Fishmonger",0,"mintFillet","true")
//
/*
this is now in the deploy
galleass.setFishPrice(0,"Pinner",1)
galleass.setFishPrice(0,"Redbass",2)
galleass.setFishPrice(0,"Catfish",3)
galleass.setFishPrice(0,"Snark",5)
galleass.setFishPrice(0,"Dangler",7)
*/
//

galleass.testMint("Dangler",0,1,2)
galleass.transferTokensToAccount("Dangler",1,"0x34aA3F359A9D614239015126635CE7732c18fDF3",2)

//
// //give account 1 a couple catfish
// galleass.testMint("Catfish",0,1,2)
//
// //give the fishmonger a bunch of copper
//
galleass.testMint("Copper",0,1,10000)
galleass.approveContract("Copper",1,"Fishmonger",10000)
galleass.transferTokens("Copper",1,"Fishmonger",10000)

galleass.testMint("Catfish",0,1,2)
galleass.sellFish(1,"Catfish",2)
