const galleass = require('./galleass.js')

galleass.compile("Galleass")
galleass.deploy("Galleass",0)

galleass.compile("Harbor")
galleass.compile("Timber")

galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildShip","true")

galleass.deploy("Timber",0)
galleass.setContract("Timber",0)


galleass.testMint("Timber",0,1,10)


//THIS HAS CHANGED NOW:::: location is appended 
//galleass.transferAndCall("Timber",1,"Harbor",2,web3.utils.fromAscii("Some Data"))

/*
galleass.setPermission("Harbor",0,"buildShip","true")
galleass.testMint("Timber",0,1,2)
galleass.approveContract("Timber",1,"Harbor",2)
galleass.attemptBuildShip(1,0)


// redeploy and setContract correctly
galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildShip","true")

galleass.testMint("Timber",0,1,2)

galleass.approveContract("Timber",1,"Harbor",2)
galleass.buildShip(1,0)

//shouldn't be able to see ship if you don't have one
galleass.attemptToSellFirstShip(2)

galleass.buyShip(2,0)

//shouldn't be able to see ship if you haven't approved
galleass.attemptToSellFirstShip(2)

galleass.approveFirst("Ships",2,"Harbor")

galleass.sellFirstShip(2)

//buy ship back
galleass.buyShip(2,0)

//still shouldn't be able to sell a ship
galleass.attemptToSellFirstShip(2)
*/
