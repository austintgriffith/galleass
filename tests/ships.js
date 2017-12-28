const galleass = require('./galleass.js')

galleass.compile("Ships")


//shouldn't be able to build a ship if the Harbor
// contract isn't registered with galleass contract
galleass.deploy("Ships",0)
galleass.setContract("Ships",0)
