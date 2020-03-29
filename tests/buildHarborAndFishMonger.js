const galleass = require('./galleass.js')

//
//---------------- vvvvv ----------------- happens in deploy ------- //
// galleass.compile("Land")
//
// galleass.deploy("Timber",0)
// galleass.setContract("Timber",0)

// galleass.deploy("Land",0)
// galleass.setContract("Land",0)
// galleass.setPermission("Land",0,"transferTimber","true")
// galleass.publish()
// galleass.reload()
//---------------- ^^^^^ ----------------- happens in deploy ------- //
galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)
// galleass.generateLand(0)

// galleass.findBestMainLand(0) // DO THIS ON REAL DEPLOY OR BIG DEPLOY BUT SKIP FOR FAST

//transfer ownership of the very first tile (could be anything from grass/forest to main hills/ stream etc) from account 0 to account 1
//galleass.transferFirstLandTile(0,1)
//puts that piece of land up for sale on behalf of account for 3 copper
// galleass.setPriceOfFirstLandTile(1,999)
// //take piece of land off the market by putting price to 0 copper
// galleass.setPriceOfFirstLandTile(1,0)
//put it back up for sale, this time for only 3 copper
// galleass.setPriceOfFirstLandTile(1,3)
//mint some copper to the 0 account so he can buy the land
galleass.testMint("Copper",0,0,100) //mint copper to 0 account
//galleass.approveContract("Copper",0,"Land",5) //approve Land to xfer account copper 5 copper (default empty land cost in LandLib)
//purchase the land tile back to account 0
galleass.buyFirstLandTile(0)

//create buildings in the middle...
galleass.editMiddleTile(0,"Harbor",100)
galleass.setPriceOfFirstTileOfType(0,100,999)
galleass.editMiddleTile(0,"Fishmonger",101)
galleass.setPriceOfFirstTileOfType(0,101,999)

galleass.setFishPrice(0,"Pinner",2)
galleass.setFishPrice(0,"Redbass",4)
galleass.setFishPrice(0,"Catfish",5)
galleass.setFishPrice(0,"Snark",8)
galleass.setFishPrice(0,"Dangler",9)
galleass.createCitizenAtTileType(0,"0x9129a6fbb3298ba8452a7c7948133c0138c0a6114af88226d6fd0ecdc7640d83","0x000f000f000f000f000f00000000000f00000000000000000000000000000000","Fishmonger")


galleass.setShipPrice(0,"Dogger","0.001")
galleass.setShipCopperPrice(0,"Schooner","9")


galleass.editMiddleTile(0,"Market",102)
galleass.setPriceOfFirstTileOfType(0,102,99)

// no need for this now until you go 667// galleass.approveContract("Timber",0,"Land",6)
//find a spot searching left to right for  (main hills or main grass =) and build a 2000 (village)
// galleass.buildTileOnFirstTileOfTypes(0,[1,2],2000)
// //put the village up for sale
// galleass.setPriceOfFirstTileOfType(0,2000,6)

//put all open land tiles up for sale
//galleass.setPriceOfAllOpenLandTiles(0,9)

//mint 6 timber to account 0
galleass.testMint("Timber",0,0,6)
//approve the land contract to take timber from account 0
