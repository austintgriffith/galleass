const galleass = require("./galleass.js")

galleass.compile("Sea")

galleass.deploy("Sea",0)
galleass.setContract("Sea",0)
galleass.setPermission("Sea",0,"transferShips","true")




<<<<<<< HEAD
//Make sure it is the Sea contract in Galleass
// if not it should fail to stock
//galleass.deploy("Sea",0)
//galleass.setContract("Sea",0)
//
//
//
//
galleass.testMint("Catfish",0,1,10)
galleass.allowSpecies("Catfish",0)
galleass.approveContract("Catfish",1,"Sea",10)
galleass.attemptStock("Catfish",1,10)
=======
// //Make sure it is the Sea contract in Galleass
// // if not it should fail to stock
// galleass.deploy("Sea",0)
// //galleass.setContract("Sea",0)
// galleass.testMint("Catfish",0,1,10)
// galleass.allowSpecies("Catfish",0)
// galleass.approveContract("Catfish",1,"Sea",10)
// galleass.attemptStock("Catfish",1,10)
/*
const fish = {
  "Pinner": 1,
  "Redbass": 1,
  "Catfish": 1,
  "Snark": 1,
  "Dangler": 1
}
*/

const fish = {
  "Pinner": 25,
  "Redbass": 20,
  "Catfish": 15,
  "Snark": 10,
  "Dangler": 5
}

for(let f in fish){
  galleass.allowSpecies(f,0)
  galleass.testMint(f,0,1,fish[f])
  galleass.approveContract(f,1,"Sea",fish[f])
  galleass.stock(f,1,fish[f])
}
>>>>>>> d4594c6bd1f31e872838900ee6133398f2bd0bc3

galleass.publish()

/*
galleass.allowSpecies("Catfish",0)
galleass.testMint("Catfish",0,1,15)
galleass.approveContract("Catfish",1,"Sea",15)
galleass.stock("Catfish",1,15)

galleass.allowSpecies("Pinner",0)
galleass.testMint("Pinner",0,1,25)
galleass.approveContract("Pinner",1,"Sea",25)
galleass.stock("Pinner",1,25)

galleass.allowSpecies("Redbass",0)
galleass.testMint("Redbass",0,1,20)
galleass.approveContract("Redbass",1,"Sea",20)
galleass.stock("Redbass",1,20)

galleass.allowSpecies("Dangler",0)
galleass.testMint("Dangler",0,1,5)
galleass.approveContract("Dangler",1,"Sea",5)
galleass.stock("Dangler",1,5)

galleass.allowSpecies("Snark",0)
galleass.testMint("Snark",0,1,10)
galleass.approveContract("Snark",1,"Sea",10)
galleass.stock("Snark",1,10)
*/
