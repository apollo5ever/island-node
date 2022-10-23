const fetch = require('node-fetch-commonjs');
const store = require('./store')


function hex2a(hex){
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;

    
}



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

  
  async function getData(next){
    let newcidList=[]
    let treasureList=[]
    let signalList=[]
  fetch(`http://147.182.177.142:9999/json_rpc`, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then((json) => {
          var search= /.*_M\b|.*_\d*bm\b|.*_\d*sm\b/
  
          console.log("search",search)
          var scData = json.result.stringkeys 
          newcidList= Object.keys(scData)
          .filter(key => search.test(key))
          .map(key=>hex2a(scData[key]))
          console.log(newcidList)
          
  

  for(var i=0; i<newcidList.length; i++){
    fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${newcidList[i]}`,{
        method: 'POST'
    })
    store(newcidList[i])
  }

  })


  
  }
module.exports = getData
 