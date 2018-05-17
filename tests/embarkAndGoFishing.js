const galleass = require("./galleass.js")


//galleass.compile("Sea")


// galleass.deploy("Sea",0)
// galleass.setContract("Sea",0)


// galleass.buyShip(2,0)
//

galleass.approveFirst("Dogger",2,"Sea")
galleass.embarkWithFirst(2,"Dogger")


galleass.findFish(2)
galleass.setSailTowardFish(2)
galleass.transactionsUntilAtFish(2)
galleass.dropAnchor(2)
galleass.castLine(2)
galleass.reelIn(2)
galleass.findFish(2)
galleass.setSailTowardFish(2)
