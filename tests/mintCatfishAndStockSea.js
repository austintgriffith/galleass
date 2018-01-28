const galleass = require("./galleass.js")

// galleass.compile("Sea")
//
// galleass.deploy("Sea",0)
// galleass.setContract("Sea",0)
//
//


galleass.allowSpecies("Catfish",0)
galleass.testMint("Catfish",0,1,15)
galleass.approveContract("Catfish",1,"Sea",15)
galleass.stock("Catfish",1,10)
galleass.stock("Catfish",1,5)

galleass.allowSpecies("Pinner",0)
galleass.testMint("Pinner",0,1,30)
galleass.approveContract("Pinner",1,"Sea",30)
galleass.stock("Pinner",1,10)
galleass.stock("Pinner",1,10)
galleass.stock("Pinner",1,10)

galleass.allowSpecies("Redbass",0)
galleass.testMint("Redbass",0,1,20)
galleass.approveContract("Redbass",1,"Sea",20)
galleass.stock("Redbass",1,10)
galleass.stock("Redbass",1,10)

galleass.allowSpecies("Dangler",0)
galleass.testMint("Dangler",0,1,5)
galleass.approveContract("Dangler",1,"Sea",5)
galleass.stock("Dangler",1,5)

galleass.allowSpecies("Snark",0)
galleass.testMint("Snark",0,1,10)
galleass.approveContract("Snark",1,"Sea",10)
galleass.stock("Snark",1,10)
