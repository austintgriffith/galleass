"use strict";
const axios = require('axios');
const EventParser = require('./modules/eventParser.js');
const LiveParser = require('./modules/liveParser.js');
const express = require('express');
const helmet = require('helmet');
const app = express();
const fs = require('fs');

const ContractLoader = require('./modules/contractLoader.js');


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
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8545'));


const FAUCETACCOUNT = 0 //index in geth
const APPPORT = 10003

let accounts
web3.eth.getAccounts().then((_accounts)=>{
  accounts=_accounts
  console.log("ACCOUNTS",accounts)
})

const GASBOOSTPRICE = 0.4

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
  console.log("balance",balance)
  if(balance==0){
    console.log("Giving some testnet eth...")
    web3.eth.sendTransaction({
        from: '0x4Dca2d4d123c6db667d81002602f9E9C7C976ede',
        to: req.params.account,
        value: '100000000000000000'
    })
    .then(function(receipt){
        console.log("RECEIPT",receipt)
    });
  }
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({address:accounts[FAUCETACCOUNT]}));
});

app.listen(APPPORT);
console.log(`http listening on `,APPPORT);
