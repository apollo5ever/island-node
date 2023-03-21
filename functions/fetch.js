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
  fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then((json) => {
          var islandSearch= /.*_M\b/
  
          
          var scData = json.result.stringkeys 
          newcidList= Object.keys(scData)
          .filter(key => islandSearch.test(key))
          .map(key=>[key.substring(0,key.length-3),hex2a(scData[key])])
          console.log(newcidList)
          
          var fundraiserSearch = /.*_\d*sm\b/
          signalList = Object.keys(scData)
          .filter(key=>fundraiserSearch.test(key))
          .map(key=>[key.substring(0,key.length-4),hex2a(scData[key]),key.charAt(key.length-4)])

          for(var i=0; i<signalList.length;i++){
            let island = signalList[i][0]
            let index = signalList[i][2]
            console.log(island)
            fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${signalList[i][1]}`,{
              method: 'POST'
          })
          store(signalList[i][1],island,"fundraiser",index)
          }

          var bountySearch = /.*_\d*bm\b/
          treasureList = Object.keys(scData)
          .filter(key=>bountySearch.test(key))
          .map(key=>[key.substring(0,key.length-4),hex2a(scData[key]),key.charAt(key.length-4)])

          for(var i=0; i<treasureList.length;i++){
            let island = treasureList[i][0]
            let index = treasureList[i][2]
            console.log(island)
            fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${treasureList[i][1]}`,{
              method: 'POST'
          })
          store(treasureList[i][1],island,"bounty",index)
          }
  

  for(var i=0; i<newcidList.length; i++){
    let island = newcidList[i][0]
    fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${newcidList[i][1]}`,{
        method: 'POST'
    })
    store(newcidList[i][1],island,"island")
  }

  })


  
  }
module.exports = getData
 