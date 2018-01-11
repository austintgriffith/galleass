const galleass = require("./galleass.js")


galleass.deploy("Galleass",0)

galleass.deploy("Sea",0)
galleass.setContract("Sea",0)
galleass.setPermission("Sea",0,"transferShips","true")

galleass.deploy("Ships",0)
galleass.setContract("Ships",0)

galleass.deploy("Timber",0)
galleass.setContract("Timber",0)

galleass.deploy("Copper",0)
galleass.setContract("Copper",0)

galleass.deploy("Catfish",0)
galleass.setContract("Catfish",0)

galleass.deploy("Pinner",0)
galleass.setContract("Pinner",0)

galleass.deploy("Redbass",0)
galleass.setContract("Redbass",0)

galleass.deploy("Snark",0)
galleass.setContract("Snark",0)

galleass.deploy("Dangler",0)
galleass.setContract("Dangler",0)

galleass.deploy("Fillet",0)
galleass.setContract("Fillet",0)


galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildShip","true")

galleass.deploy("Fishmonger",0)
galleass.setContract("Fishmonger",0)
galleass.setPermission("Fishmonger",0,"transferFish","true")
galleass.setPermission("Fishmonger",0,"mintFillet","true")

galleass.testMint("Copper",0,1,100)
galleass.approveContract("Copper",1,"Fishmonger",100)
galleass.transferTokens("Copper",1,"Fishmonger",100)

galleass.setFishPrice(0,"Pinner",1)
galleass.setFishPrice(0,"Redbass",2)
galleass.setFishPrice(0,"Catfish",3)
galleass.setFishPrice(0,"Snark",5)
galleass.setFishPrice(0,"Dangler",7)
