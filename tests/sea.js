const galleass = require('./galleass.js')



galleass.compile("Sea")
galleass.deploy("Sea",0)
galleass.setContract("Sea",0)

galleass.publish();
//galleass.metamask();

galleass.allowSpecies("Catfish",0)
//mint 10 from account 0 to account 1
galleass.testMint("Catfish",0,1,15)
galleass.approveContract("Catfish",1,"Sea",15)
galleass.stock("Catfish",1,15)

galleass.buyShip(2,0)

galleass.approveFirst("Ships",2,"Sea")
galleass.embarkWithFirst(2)

galleass.findFish(2)
galleass.setSailTowardFish(2)
galleass.transactionsUntilAtFish(2)
galleass.dropAnchor(2)
galleass.castLine(2)
galleass.reelIn(2)
