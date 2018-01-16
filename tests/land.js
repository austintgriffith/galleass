const galleass = require('./galleass.js')

//galleass.compile("Land")


//shouldn't be able to build a ship if the Harbor
// contract isn't registered with galleass contract
galleass.deploy("Land",0)
galleass.setContract("Land",0)
