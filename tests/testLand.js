const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
//---------------- //----------------
// galleass.compile("TimberCamp")
// galleass.deploy("TimberCamp",0)
// galleass.setContract("TimberCamp",0)
//----------------
//----------------
galleass.compile("LandLib")
galleass.deploy("LandLib",0)
galleass.setContract("LandLib",0)
galleass.setPermission("LandLib",0,"useCitizens","true")
galleass.setPermission("LandLib",0,"mintTimber","true")
galleass.setPermission("LandLib",0,"mintGreens","true")
//----------------
// galleass.compile("Citizens")
// galleass.deploy("Citizens",0)
// galleass.setContract("Citizens",0)
// galleass.setPermission("Citizens",0,"transferFood","true")
galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //

//galleass.testMint("Fillet",0,1,12)
