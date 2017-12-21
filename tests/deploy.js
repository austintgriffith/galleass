const galleass = require("./galleass.js")

galleass.deploy("Galleass",0)

galleass.deploy("Sea",0)
galleass.setContract("Sea",0)

galleass.deploy("Ships",0)
galleass.setContract("Ships",0)

galleass.deploy("Harbor",0)
galleass.setContract("Harbor",0)
galleass.setPermission("Harbor",0,"buildShip","true")

galleass.deploy("Timber",0)
galleass.setContract("Timber",0)

galleass.deploy("Catfish",0)
galleass.setContract("Catfish",0)
