const galleass = require('./galleass.js')

galleass.compile("Harbor")


//shouldn't be able to build a ship if the Harbor
// contract isn't registered with galleass contract
galleass.deploy("Harbor",0)
//galleass.setContract("Harbor",0)
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
