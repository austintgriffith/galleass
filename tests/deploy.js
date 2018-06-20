const galleass = require("./galleass.js")


galleass.deploy("Galleass",0)

galleass.deploy("Experience",0)
galleass.setContract("Experience",0)

galleass.deploy("Sea",0)
galleass.setContract("Sea",0)
galleass.setPermission("Sea",0,"transferDogger","true")
galleass.setPermission("Sea",0,"updateExperience","true")

galleass.deploy("LandLib",0)
galleass.setContract("LandLib",0)
galleass.setPermission("LandLib",0,"useCitizens","true")

galleass.deploy("Land",0)
galleass.setContract("Land",0)
galleass.setPermission("Land",0,"transferTimber","true")

galleass.deploy("Dogger",0)
galleass.setContract("Dogger",0)

galleass.deploy("Timber",0)
galleass.setContract("Timber",0)

galleass.deploy("TimberCamp",0)
galleass.setContract("TimberCamp",0)
galleass.setPermission("TimberCamp",0,"mintTimber","true")

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
galleass.setPermission("Harbor",0,"buildDogger","true")
galleass.setPermission("Harbor",0,"updateExperience","true")

galleass.deploy("Fishmonger",0)
galleass.setContract("Fishmonger",0)
galleass.setPermission("Fishmonger",0,"transferFish","true")
galleass.setPermission("Fishmonger",0,"mintFillet","true")
galleass.setPermission("Fishmonger",0,"updateExperience","true")

galleass.testMint("Copper",0,1,10000)
galleass.approveContract("Copper",1,"Fishmonger",10000)
galleass.transferTokens("Copper",1,"Fishmonger",10000)

galleass.setFishPrice(0,"Pinner",1)
galleass.setFishPrice(0,"Redbass",2)
galleass.setFishPrice(0,"Catfish",2)
galleass.setFishPrice(0,"Snark",3)
galleass.setFishPrice(0,"Dangler",4)

galleass.deploy("Ipfs",0)
galleass.setContract("Ipfs",0)


galleass.deploy("Village",0)
galleass.setContract("Village",0)
galleass.setPermission("Village",0,"createCitizens","true")


galleass.deploy("Citizens",0)
galleass.setContract("Citizens",0)
galleass.setPermission("Citizens",0,"transferFood","true")


galleass.deploy("Market",0)
galleass.setContract("Market",0)
galleass.setPermission("Market",0,"transferTimber","true")
