const galleass = require("./galleass.js")

galleass.publish()

const fs = require("fs");
let content = fs.readFileSync("app/public/contracts.template").toString();

console.log(content);
