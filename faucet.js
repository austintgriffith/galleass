"use strict";
const axios = require('axios');
const EventParser = require('./modules/eventParser.js');
const LiveParser = require('./modules/liveParser.js');
const express = require('express');
const helmet = require('helmet');
const app = express();
const fs = require('fs');

const ContractLoader = require('./modules/contractLoader.js');

const https = require('https')


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
var cors = require('cors')
app.use(cors())
let contracts;
let tokens = [];
var Web3 = require('web3');
var web3 = new Web3();

const RPC = 'http://localhost:48545'

web3.setProvider(new web3.providers.HttpProvider(RPC));


const FAUCETACCOUNT = 2 //index in geth
//const APPPORT = 80

let accounts
web3.eth.getAccounts().then((_accounts)=>{
  accounts=_accounts
  console.log("ACCOUNTS",accounts)
})


app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/",req.params)
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({address:accounts[FAUCETACCOUNT]}));
});


app.get('/account/:account', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/account",req.params.account)
  let balance = await web3.eth.getBalance(req.params.account)
  console.log("balance",balance/10**18)
  if(balance==0){
    console.log("Giving some xdai...")
    let newWeb3 = new Web3(new Web3.providers.HttpProvider(RPC));
    let tx = {
        from: web3.utils.toChecksumAddress(accounts[FAUCETACCOUNT]),
        to: web3.utils.toChecksumAddress(req.params.account),
        value: ''+(0.005*10**18),
        gas: "30000",
        gasPrice: ""+(1.0101*1000000000)
    }
    console.log(tx)
    /*web3.eth.sendTransaction(tx, function(error, hash){
      console.log(error, hash)
    });*/

    // using the event emitter
    newWeb3.eth.sendTransaction(tx)
    .on('transactionHash', function(hash){
        console.log("hash",hash)
    })
    .on('receipt', function(receipt){
        console.log("receipt",receipt)
    })
    .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
  }
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({address:accounts[FAUCETACCOUNT]}));
});

//app.listen(APPPORT);
//console.log(`http listening on `,APPPORT);

https.createServer({
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('cert.pem'),
  ca: fs.readFileSync('fullchain.pem')
}, app).listen(443, () => {
  console.log('Listening on 443...')
})
