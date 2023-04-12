const fetch = require('node-fetch-commonjs');

const data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "1",
    "method": "DERO.GetSC",
    "params": {
      "scid": "ce99faba61d984bd4163b31dd4da02c5bff32445aaaa6fc70f14fe0d257a15c3",
      "code": false,
      "variables": true
    }
  });

async function getSC(req,res,next){
    console.log("getting sc")
    fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: data,
        headers: {'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then((json) => {   
            
            var scData = json.result.stringkeys 

            var islandSearch= /.*_M\b/
  
          
          
          req.names= Object.keys(scData)
          .filter(key => islandSearch.test(key))
          .map(key=>key.substring(0,key.length-2))
         
            
            req.scData=scData
            next()
      }
      )
}

module.exports = getSC