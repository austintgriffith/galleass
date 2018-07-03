const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
galleass.compile("Bay")
galleass.deploy("Bay",0)
galleass.setContract("Bay",0)
galleass.setPermission("Bay",0,"transferDogger","true")
galleass.setPermission("Bay",0,"updateExperience","true")
//----------------
galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
