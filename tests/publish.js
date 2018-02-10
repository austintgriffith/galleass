// const galleass = require("./galleass.js")
//
// galleass.publish()

const fs = require("fs");
let content = fs.readFileSync("app/public/contracts.template").toString();

let contractsHtml = ""

let etherscan = "http://ropsten.etherscan.io"

let loadContracts = [
  "Galleass",
  "Land",
  "Sea",
  "Harbor",
  "Fishmonger",
  "Dogger",
  "Timber",
  "Catfish",
  "Pinner",
  "Redbass",
  "Snark",
  "Dangler",
  "Copper",
  "Experience",
  "Galleasset",
  "Staged",
]

contractsHtml = "<table cellspacing='0' cellpadding='10' border='0'>"

for(let c in loadContracts){
  console.log(loadContracts[c])
  let address = ""
  let link = ""
  let block = ""
  let source = "https://github.com/austintgriffith/galleass/blob/master/"+loadContracts[c]+"/"+loadContracts[c]+".sol"
  let image = false;
  try{
    let imageLocation = loadContracts[c].toLowerCase()+".png"
    image = fs.existsSync("app/public/"+imageLocation)

    if(image) image = imageLocation
    address = fs.readFileSync(loadContracts[c]+"/"+loadContracts[c]+".address").toString().trim();
    link = etherscan+"/address/"+address+"#code"
    block = fs.readFileSync(loadContracts[c]+"/"+loadContracts[c]+".blockNumber").toString().trim();

  }catch(e){}
  console.log(image,address,link,block,source)
  if(image) {
    console.log("IMAGE:",image)
    image = "<img style='vertical-align:middle;max-height:40px;max-width:40px' src='"+image+"'/>"
  }else{
    image=""
  }
  if(block){
    let blockLink = etherscan+"/block/"+block+""
    block="<a href='"+blockLink+"' target='_blank'>"+"#"+block+"</a>"
  }else{
    block=""
  }

  let contactLink = ""
  if(link){
    contactLink="<a href='"+link+"' target='_blank'><img style='max-width:30px;vertical-align:middle;' src='smartcontract.png' /></a>  <a href='"+link+"' target='_blank'>"+address+"</a>"
  }

  contractsHtml += "<tr><td>"+image+"</td><td>"+loadContracts[c]+"</td><td><a href='"+source+"' target='_blank'><img style='max-width:30px;vertical-align:middle;' src='github.png' /></a></td><td>"+contactLink+"</td><td>"+block+"</td></tr>"
}

contractsHtml += "</table>"




content = content.split("##CONTRACTS##").join(contractsHtml);

//console.log(content)

fs.writeFileSync("app/public/contracts.html",content);
