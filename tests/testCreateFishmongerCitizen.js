const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
galleass.createCitizenAtTileType(0,"0x9129a6fbb3298ba8452a7c7948133c0138c0a6114af88226d6fd0ecdc7640d83","0x000f000f000f000f000f00000000000f00000000000000000000000000000000","Fishmonger")

galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
