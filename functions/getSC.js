const fetch = require('node-fetch-commonjs');
const hex2a = require('./hex2a')

/* const registryData = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "1",
    "method": "DERO.GetSC",
    "params": {
      "scid": "a5daa9a02a81a762c83f3d4ce4592310140586badb4e988431819f47657559f7",
      "code": false,
      "variables": true
    }
  }); */
  //SIMULATOR
  const registryData = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "1",
    "method": "DERO.GetSC",
    "params": {
      "scid": "d44eb42b8930e77301ee6e8b44caa21e4231dddf1d3ddcafc0342f564826cc9f",
      "code": false,
      "variables": true
    }
  });

/* const bountyData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "fc2a6923124a07f33c859f201a57159663f087e2f4b163eaa55b0f09bf6de89f",
    "code": false,
    "variables": true
  }
}) */
//SIMULATOR
const bountyData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "9087dc896a8095efd2934618df5954e66720cc87eb88ea95f9e788eb914084a1",
    "code": false,
    "variables": true
  }
})

/* const fundData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "d6ad66e39c99520d4ed42defa4643da2d99f297a506d3ddb6c2aaefbe011f3dc",
    "code": false,
    "variables": true
  }
}) */
//SIMULATOR
const fundData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "a982bcefeffb36931cc424f86859bda2052423c958118ae61f1acb43631737c9",
    "code": false,
    "variables": true
  }
})

/* const subData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "a4943b10767d3b4b28a0c39fe75303b593b2a8609b07394c803fca1a877716cc",
    "code": false,
    "variables": true
  }
}) */
//SIMULATOR
const subData = JSON.stringify({
  "jsonrpc": "2.0",
  "id": "1",
  "method": "DERO.GetSC",
  "params": {
    "scid": "8a6b36c7593db6ffece36f7e1555ed09c4c6a59ab0824f56c198ee4e1f2dc7d2",
    "code": false,
    "variables": true
  }
})

  async function getSC(req, res, next) {
    console.log("getting sc")
    let tries = 0
    let islands = []
  
    try {
     /*  const response = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: registryData,
        headers: {'Content-Type': 'application/json' } */
        //SIMULATOR
        const response = await fetch(`http://localhost:20000/json_rpc`, {
        method: 'POST',
        body: registryData,
        headers: {'Content-Type': 'application/json' }
      })
  
      const json = await response.json()
      const registry = json.result.stringkeys 
      const islandSearch = /^S::PRIVATE\-ISLANDS::(.*)$/;

      req.names = Object.keys(registry)
        .filter(key => islandSearch.test(key))
        .map(key => key.substring(20,))
      req.registry = registry
      console.log("registry",registry)
      console.log("names",req.names)

      //get bounties contract data

      /* const bountyRes = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: bountyData,
        headers: {'Content-Type': 'application/json' }
      }) */
      //SIMULATOR
      const bountyRes = await fetch(`http://localhost:20000/json_rpc`, {
        method: 'POST',
        body: bountyData,
        headers: {'Content-Type': 'application/json' }
      })

      const bountyJson = await bountyRes.json()
      const bounties = bountyJson.result.stringkeys
      req.bounties = bounties

      //get fundraiser contract data
      /* const fundRes = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: fundData,
        headers: {'Content-Type': 'application/json' }
      }) */
      //SIMULATOR
      const fundRes = await fetch(`http://localhost:20000/json_rpc`, {
        method: 'POST',
        body: fundData,
        headers: {'Content-Type': 'application/json' }
      })

      const fundJson = await fundRes.json()
      const fundraisers = fundJson.result.stringkeys
      req.fundraisers = fundraisers

      //get subscription contract data
      /* const subRes = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
        body: subData,
        headers: {'Content-Type': 'application/json' }
      }) */
      //SIMULATOR
      const subRes = await fetch(`http://localhost:20000/json_rpc`, {
        method: 'POST',
        body: subData,
        headers: {'Content-Type': 'application/json' }
      })

      const subJson = await subRes.json()
      const subscriptions = subJson.result.stringkeys
      req.subscriptions = subscriptions


      for(let i=0;i<req.names.length;i++){
        let island = new Object({"name":req.names[i]})
        island.scid = hex2a(registry[`S::PRIVATE-ISLANDS::${island.name}`])
        const islandData = JSON.stringify({
          "jsonrpc": "2.0",
          "id": "1",
          "method": "DERO.GetSC",
          "params": {
            "scid": island.scid,
            "code": false,
            "variables": true
          }
        })

        /* const islandRes = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
          method: 'POST',
          body: islandData,
          headers: {'Content-Type': 'application/json' }
        }) */
        const islandRes = await fetch(`http://localhost:20000/json_rpc`, {
          method: 'POST',
          body: islandData,
          headers: {'Content-Type': 'application/json' }
        })

        const islandJson = await islandRes.json()
        const islandSC = islandJson.result.stringkeys
        if(islandSC['metadata']) island.M=hex2a(islandSC['metadata'])
        

        //now add bounties



        islands.push(island)

      }
      req.islands=islands
      console.log("islands",req.islands)

     
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