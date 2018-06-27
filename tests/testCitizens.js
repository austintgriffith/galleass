const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
//----------------
galleass.compile("CitizensLib")
galleass.deploy("CitizensLib",0)
galleass.setContract("CitizensLib",0)
galleass.setPermission("CitizensLib",0,"transferFood","true")
//----------------
// galleass.compile("Citizens")
// galleass.deploy("Citizens",0)
// galleass.setContract("Citizens",0)
// galleass.setPermission("Citizens",0,"transferFood","true")
galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //

//galleass.testMint("Fillet",0,1,12)
