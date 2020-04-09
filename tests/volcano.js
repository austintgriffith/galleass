const galleass = require('./galleass.js')




galleass.generateLand(0)


galleass.testMint("Copper",0,0,100) //mint copper to 0 account
//galleass.approveContract("Copper",0,"Land",5) //approve Land to xfer account copper 5 copper (default empty land cost in LandLib)
//purchase the land tile back to account 0
galleass.buyFirstLandTile(0)

//create buildings in the middle...
galleass.editMiddleTile(0,"Harbor",100)
galleass.setPriceOfFirstTileOfType(0,100,40)
galleass.editMiddleTile(0,"Fishmonger",101)
galleass.setPriceOfFirstTileOfType(0,101,90)

galleass.testMint("Timber",0,0,26)
galleass.approveContract("Timber",0,"Harbor",36)
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")

galleass.setShipPrice(0,"Dogger","0.001")
galleass.setShipCopperPrice(0,"Schooner","9")

galleass.setFishPrice(0,"Pinner",2)
galleass.setFishPrice(0,"Redbass",4)
galleass.setFishPrice(0,"Catfish",5)
galleass.setFishPrice(0,"Snark",8)
galleass.setFishPrice(0,"Dangler",9)
galleass.createCitizenAtTileType(0,"0x9129a6fbb3298ba8452a7c7948133c0138c0a6114af88226d6fd0ecdc7640d83","0x000f000f000f000f000f00000000000f00000000000000000000000000000000","Fishmonger")




galleass.editMiddleTile(0,"Market",102)
galleass.setPriceOfFirstTileOfType(0,102,25)

// no need for this now until you go 667// galleass.approveContract("Timber",0,"Land",6)
//find a spot searching left to right for  (main hills or main grass =) and build a 2000 (village)
// galleass.buildTileOnFirstTileOfTypes(0,[1,2],2000)
// //put the village up for sale
// galleass.setPriceOfFirstTileOfType(0,2000,6)



///////////////// mint timber build ships:



galleass.testMint("Timber",0,0,100)
//
// //make sure you can't build ships directly
// galleass.approveContract("Timber",1,"Dogger",2)
// galleass.attemptBuildShipDirectly(1,"Dogger")
//
// galleass.approveContract("Timber",1,"Dogger",0)
//
// //make sure you can't build ships in the harbor with no timber
// galleass.attemptToBuildShip(1,"Dogger")

//make sure you can build ships in the harbor with timber
galleass.approveContract("Timber",0,"Harbor",20)
galleass.buildShip(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShip(0,"Dogger")


////////// mint and approve fish and stock bay





galleass.allowSpecies("Catfish",0)
galleass.testMint("Catfish",0,1,15)
galleass.approveContract("Catfish",1,"Bay",15)
galleass.stock("Catfish",1,10)
galleass.stock("Catfish",1,5)

galleass.allowSpecies("Pinner",0)
galleass.testMint("Pinner",0,1,30)
galleass.approveContract("Pinner",1,"Bay",30)
galleass.stock("Pinner",1,10)
galleass.stock("Pinner",1,10)
galleass.stock("Pinner",1,10)

galleass.allowSpecies("Redbass",0)
galleass.testMint("Redbass",0,1,20)
galleass.approveContract("Redbass",1,"Bay",20)
galleass.stock("Redbass",1,10)
galleass.stock("Redbass",1,10)

galleass.allowSpecies("Dangler",0)
galleass.testMint("Dangler",0,1,5)
galleass.approveContract("Dangler",1,"Bay",5)
galleass.stock("Dangler",1,5)

galleass.allowSpecies("Snark",0)
galleass.testMint("Snark",0,1,10)
galleass.approveContract("Snark",1,"Bay",10)
galleass.stock("Snark",1,10)




//buy ship and set sail to trigger ship actions and test fish stuff

galleass.buyShip(0,"Dogger");
galleass.approveFirst("Dogger",0,"Bay")
galleass.embarkWithFirst(0,"Dogger")
galleass.findFish(0)
galleass.setSailTowardFish(0)





///mint copper and test fish monger:

galleass.testMint("Copper",0,0,10000)//mint 10000 copper to account 0
galleass.transferAndCall("Copper",0,"Fishmonger",10000,"0x00")//account 0 sends 100 copper to the fishmonger to (stock the contract action 0x00)

galleass.testMint("Catfish",0,1,10)//mint 10 Catfish to account 1
galleass.sellFish(1,"Catfish",10)//sell and butcher 10 catfish to produce 10 fillets at the fish monger

galleass.testMint("Copper",0,1,100)//mint 100 copper to account 1
galleass.transferAndCall("Copper",1,"Fishmonger",6,"0x01")//account 1 sends 6 copper to the fishmonger to buy (Action 0x01) (2) fillets (assuming price is still 3?)







////finishing touches



galleass.cloud(0,1,200)
galleass.cloud(0,2,120)
galleass.cloud(0,3,20)
galleass.cloud(0,4,90)
galleass.cloud(0,5,230)
galleass.cloud(0,6,150)
galleass.cloud(0,7,60)

galleass.approveContract("Timber",0,"Harbor",10)

galleass.buildShip(0,"Dogger")
galleass.buildShip(0,"Dogger")
galleass.buildShip(0,"Dogger")
galleass.buildShip(0,"Dogger")
galleass.buildShip(0,"Dogger")





galleass.setSellPriceAtMarket(0,"Fillet",3)
galleass.setSellPriceAtMarket(0,"Greens",4)
galleass.setSellPriceAtMarket(0,"Timber",5)
galleass.setSellPriceAtMarket(0,"Stone",6)

galleass.setBuyPriceAtMarket(0,"Fillet",2)
galleass.setBuyPriceAtMarket(0,"Greens",3)
galleass.setBuyPriceAtMarket(0,"Timber",4)
galleass.setBuyPriceAtMarket(0,"Stone",5)

galleass.testMint("Copper",0,0,1000) //mint copper to 0 account
galleass.transferAndCall("Copper",0,"Market",1000,"0x00")//account 0 sends 100 copper to the fishmonger to (stock the contract action 0x00)

galleass.testMint("Stone",0,0,100) //mint copper to 0 account
galleass.transferAndCall("Stone",0,"Market",100,"0x00")//account 0 sends 100 copper to the fishmonger to (stock the contract action 0x00)

galleass.testMint("Timber",0,0,150) //mint copper to 0 account
galleass.transferAndCall("Timber",0,"Market",150,"0x00")//account 0 sends 100 copper to the fishmonger to (stock the contract action 0x00)

galleass.testMint("Greens",0,0,50) //mint copper to 0 account
galleass.transferAndCall("Greens",0,"Market",50,"0x00")//account 0 sends 100 copper to the fishmonger to (stock the contract action 0x00)


//and then node publish and npm run build and node deploy and node invalidate


galleass.testMint("Timber",0,0,26)
galleass.approveContract("Timber",0,"Harbor",36)
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShipFast(0,"Dogger")
galleass.buildShip(0,"Dogger")
