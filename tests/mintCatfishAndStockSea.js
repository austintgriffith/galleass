const galleass = require("./galleass.js")

// galleass.compile("Sea")
//
// galleass.deploy("Sea",0)
// galleass.setContract("Sea",0)
//
//

// //Make sure it is the Sea contract in Galleass
// // if not it should fail to stock
// galleass.deploy("Sea",0)
// //galleass.setContract("Sea",0)
// galleass.testMint("Catfish",0,1,10)
// galleass.allowSpecies("Catfish",0)
// galleass.approveContract("Catfish",1,"Sea",10)
// galleass.attemptStock("Catfish",1,10)


galleass.allowSpecies("Catfish",0)

//mint 10 from account 0 to account 1
galleass.testMint("Catfish",0,1,15)

galleass.approveContract("Catfish",1,"Sea",15)

galleass.stock("Catfish",1,15)






galleass.allowSpecies("Pinner",0)
galleass.testMint("Pinner",0,1,25)
galleass.approveContract("Pinner",1,"Sea",25)
galleass.stock("Pinner",1,25)


galleass.allowSpecies("Redbass",0)
galleass.testMint("Redbass",0,1,10)
galleass.approveContract("Redbass",1,"Sea",10)
galleass.stock("Redbass",1,10)
