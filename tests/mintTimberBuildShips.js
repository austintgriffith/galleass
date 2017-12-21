const galleass = require("./galleass.js")

galleass.testMint("Timber",0,1,100)

//make sure you can't build ships directly
galleass.approveContract("Timber",1,"Ships",2)
galleass.attemptBuildShipDirectly(1,0)
galleass.approveContract("Timber",1,"Ships",0)

//make sure you can't build ships in the harbor with no timber
galleass.attemptToBuildShip(1,0)

//make sure you can build ships in the harbor with timber
galleass.approveContract("Timber",1,"Harbor",4)
galleass.buildShip(1,0)

//make sure you can revoke timber and it will fail to build ships at the harbor
galleass.approveContract("Timber",1,"Harbor",0)
galleass.attemptToBuildShip(1,0)

//make sure you can build ships in the harbor with timber
galleass.approveContract("Timber",1,"Harbor",2)
galleass.buildShip(1,0)
