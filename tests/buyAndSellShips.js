const galleass = require("./galleass.js")


//should be able to buy a cheap ship
galleass.attemptBuyShipCheap(2,"Dogger")// this went through, you should make sure it craps out instead of waiting for the transaction

//shouldn't be able to see ship if you don't have one
galleass.attemptToSellFirstShip(2,"Dogger")

galleass.buyShip(2,"Dogger")

//shouldn't be able to sell ship if you haven't approved
galleass.attemptToSellFirstShip(2,"Dogger")

galleass.buyShip(2,"Dogger")

galleass.approveFirst("Dogger",2,"Harbor")

galleass.sellFirstShip(2,"Dogger")
