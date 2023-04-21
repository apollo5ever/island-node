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

  async function getSC(req, res, next) {
    console.log("getting sc")
    let tries = 0
  
    try {
      const response = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: data,
        headers: {'Content-Type': 'application/json' }
      })
  
      const json = await response.json()
      const scData = json.result.stringkeys 
      const islandSearch = /.*_M\b/
      req.names = Object.keys(scData)
        .filter(key => islandSearch.test(key))
        .map(key => key.substring(0, key.length - 2))
      req.scData = scData
      console.log(scData)
      next()
  
    } catch (err) {
      tries++
      console.error(`Error fetching SC data, try ${tries}:`, err)
      if (tries < 3) {
        setTimeout(getSC, 1000, req, res, next)
      } else {
        console.error('Max retries reached. Giving up.')
        next()
      }
    }
  }
  

module.exports = getSC