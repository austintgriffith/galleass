const galleass = require("./galleass.js")

//---------------- vvvvv ----------------- happens in deploy ------- //
galleass.compile("Market")
galleass.deploy("Market",0)
galleass.setContract("Market",0)
galleass.setPermission("Market",0,"transferTimber","true")
galleass.publish()
galleass.reload()
// //---------------- ^^^^^ ----------------- happens in deploy ------- //
//
//setContractOfTile:(accountindex,x,y,tileIndex,name)
galleass.setContractOfTile(0,26535,24925,12,"Market")
galleass.setPriceOfFirstTileOfType(0,102,9)
