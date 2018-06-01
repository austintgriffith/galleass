const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
galleass.compile("Timber")
galleass.deploy("Timber",0)
galleass.setContract("Timber",0)

galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
