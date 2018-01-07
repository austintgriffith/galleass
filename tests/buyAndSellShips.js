const galleass = require("./galleass.js")


//should be able to buy a cheap ship
galleass.attemptBuyShipCheap(2,0)// this went through, you should make sure it craps out instead of waiting for the transaction

//shouldn't be able to see ship if you don't have one
galleass.attemptToSellFirstShip(2)

galleass.buyShip(2,0)

//shouldn't be able to see ship if you haven't approved
galleass.attemptToSellFirstShip(2)

galleass.buyShip(2,0)

galleass.approveFirst("Ships",2,"Harbor")

galleass.sellFirstShip(2)
