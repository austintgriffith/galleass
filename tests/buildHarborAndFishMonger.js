const galleass = require('./galleass.js')

galleass.compile("Land")

galleass.deploy("Land",0)
galleass.setContract("Land",0)

galleass.buildTile(0,"Harbor",100)
galleass.buildTile(0,"Fishmonger",101)
