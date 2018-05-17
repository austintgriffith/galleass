const galleass = require('./galleass.js')


//---------------- vvvvv ----------------- happens in deploy ------- //
// galleass.compile("Land")
galleass.deploy("Land",0)
galleass.setContract("Land",0)

galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
galleass.generateLand(0)

galleass.editMiddleTile(0,"Harbor",100)
galleass.editMiddleTile(0,"Fishmonger",101)
galleass.editMiddleTile(0,"Village",2000)//,"0x34aa3f359a9d614239015126635ce7732c18fdf3")

galleass.transferFirstLandTile(0,1)
galleass.setPriceOfFirstLandTile(1,1)
galleass.setPriceOfFirstLandTile(1,0)

//set the price to 1
galleass.setPriceOfFirstLandTile(1,1)
//try to buy it back from the 0 account
galleass.testMint("Copper",0,0,10) //mint copper to 0 account
galleass.approveContract("Copper",0,"Land",10) //approve Land to xfer account 0 copper

galleass.buyFirstLandTile(0)

//put the village up for sale
galleass.setPriceOfFirstTileOfType(0,2000,2)



// galleass.editMiddleTile(0,"Village",2000,"0x34aa3f359a9d614239015126635ce7732c18fdf3")
// galleass.setPriceOfTile(0,28379,52695,17,13)//setPriceOfSecondTileOfType(0,2000,14)
