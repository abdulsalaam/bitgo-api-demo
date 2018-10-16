/*
 * Author:      Abdul Salam
 * Date:        14/10/2018
 * Description: Node.JS and Express based server for the Bitgo API v2
 *              web application
 */

var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var util = require('util');
const BitGoJS = require('bitgo');
var bitgo;
configData = require('./config.json');
console.log('config:',configData['txrp']);
/*
 * This function prepares the server by bitgo initilization
 */
function setUp() {
bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: configData.accessToken });
}

/*
 * This function handles the ajax call to the url '/init'. It uses the bitgo
 
 */
function initApi(request,response) {
	console.log('initApi called')
    bitgo.session({}, function callback(err, session) {
      if (err) {
        // handle error
      }
      //console.dir(session);
      //response.json(session);
    });
    //console.log('request:',request);
    if(request.query.w != null) {
        let walletId = configData[request.query.w].walletId;
        console.log('wallet id from config:',walletId);
        bitgo.coin('txrp').wallets().get({ id: walletId })
        .then(function(wallet) {
          // print the wallet
          console.dir(wallet._wallet);
          let bal = Number(wallet._wallet.balanceString) / 1000000;
          response.json({"bal":bal});
        });
    }
}

function paymentApi(request, response) {
    
     bitgo.unlock({ otp: '0000000' })
    .then(function(unlockResponse) {
      console.dir(unlockResponse);
    });
    
    
    console.log('request:',request.body);
    let walletId = configData[request.body.walletType].walletId;
     console.log('amount:',request.body.amount)
     console.log('Exponetial:',configData[request.body.walletType].multiplerExponetial)
    let amt = Number(request.body.amount) * configData[request.body.walletType].multiplerExponetial;

    bitgo.coin('txrp').wallets().get({ id: walletId })
    .then(function(wallet) {
    const availableBal = Number(wallet._wallet.balanceString);  
    let remainBal = (availableBal - amt) / 1000000; 
    let params = {
      amount: amt.toString(),
      address: request.body.toAddress,
      walletPassphrase: configData.passPhrase
    };
    wallet.send(params)
    .then(function(transaction) {
      // print transaction details
      //console.dir(transaction);
       response.json({"bal":remainBal});
    });

    });
}

/*
 * ----- Start of The main server code -----
 */

setUp();

var app = express();

app.use(bodyparser.json());

app.use(function(req, res, next) {
    util.log(`Request => url: ${req.url}, method: ${req.method}`);
    next();
});

app.use(express.static('./'));

app.get('/init', function(req, res) {
    initApi(req,res);
});


app.post('/transfer', function(req, res) {
   // console.log('request:',req)
   paymentApi(req, res);
});

app.listen(3001);

util.log('-> Express server @localhost:3001');