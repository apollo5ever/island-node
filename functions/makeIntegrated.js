//require('dotenv').config()
const fetch = require('node-fetch-commonjs');
const store = require('./store')


function hex2a(hex){
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;

    
}

let auth = "Basic " + Buffer.from(`${process.env.LOGIN}:${process.env.PASS}`).toString('base64')




  
  async function makeIntegrated(req,res,next){
    var data
    if(req.params.type=="sub"){  
       data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": "1",
      "method": "MakeIntegratedAddress",
      "params": {
        "payload_rpc": [
          {
            "name":"D",
            "datatype":"U",
            "value":1
          },
              {
                  "name": "address",
                  "datatype": "S",
                  "value": req.params.address
              },
              {
                  "name": "tier",
                  "datatype":"S",
                  "value":req.params.tier
              }
          ]
      }
    });
  }
    else if(req.params.type=="topup"){
       data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": "1",
        "method": "MakeIntegratedAddress",
        "params": {
          "payload_rpc": [
            {
              "name":"D",
              "datatype":"U",
              "value":2
            },
                {
                    "name": "address",
                    "datatype": "S",
                    "value": req.params.address
                },
                {
                    "name": "tier",
                    "datatype":"S",
                    "value":req.params.tier
                }
            ]
        }
      });

    }else{
      res.send({"address":"error"})
    }

 

try{ 
  const result = await fetch(`http://localhost:10103/json_rpc`, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': 'application/json' ,'Authorization':auth}
    })
    const body = await result.json()
    const address = body.result.integrated_address
    res.send({"address":address})
  }catch{
    res.send({"address":"error"})
  }
  
  }
module.exports = makeIntegrated
 