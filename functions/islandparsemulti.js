const Island = require('../models/island')
const hex2a = require('./hex2a')
const fetch = require('node-fetch-commonjs');

async function parseIslands (req,res,next) {
    console.log("parsing island")
    let islands = []
    let names = req.names
    console.log("names",names)
    let scData = req.scData
    for(let q = 0; q<names.length; q++){
    let name = names[q]
    let island = await Island.findOne({ name: name });
    let exists = true
    if(!island){
        console.log("no island found")
         island = new Island({name:name})
         exists = false

    }
        if(hex2a(scData[`${name}_M`]) != island.M){
            console.log("island?",island)
            island.M = hex2a(scData[`${name}_M`])
            // pull from ipfs
            const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${island.M}`,{
                method: 'POST'
            
            })
            
            const data = await response.json()
            console.log(data)
            //update island.bio etc
            island.bio = data.bio
            island.image = data.image
            island.tiers = data.tiers
            
        }
        for(let j =0; j<island.tiers.length; j++){
            island.tiers[j].available = scData[`${name+j}_Av`]
            island.tiers[j].amount = scData[`${name+j}_Am`]
            island.tiers[j].address = scData[`${name+j}_Ad`]
            island.tiers[j].interval = scData[`${name+j}_I`]
            island.tiers[j].island=name
        }
        let i = 0;
        while (scData[`${name+i}_bm`]) {
            if(i>=island.bounties.length){
                //pull from ipfs
                fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(scData[`${name+i}_bm`])}`,{
              method: 'POST'
          })
          const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(scData[`${name+i}_bm`])}`,{
            method: 'POST'
        
        })
        
        const data = await response.json()
        console.log("bounty data",data)
                island.bounties.push(new Object({
                    "bm":hex2a(scData[`${name+i}_bm`]),
                    "name":data.name,
                    "tagline": data.tagline,
                    "description":data.description,
                    "image":data.image,
                    "index":i,
                    "island":name
                }))
            }
                island.bounties[i].treasure = scData[`${name+i}_T`]
                island.bounties[i].expiry = scData[`${name+i}_E`]
                //etc
            
         
          i++;
        }

        let k = 0;
        while (scData[`${name+k}_sm`]) {
            if(k>=island.fundraisers.length){
                //pull from ipfs
                fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(scData[`${name+k}_sm`])}`,{
                    method: 'POST'
                })
                const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(scData[`${name+k}_sm`])}`,{
                  method: 'POST'
              
              })
              
              const data = await response.json()
                island.fundraisers.push(new Object({
                    "sm":hex2a(scData[`${name+k}_sm`]),
                    "name":data.name,
                    "tagline":data.tagline,
                    "index":k,
                    "description":data.description,
                    "image":data.image,
                    "island":name
                }))
            }
                island.fundraisers[k].goal = scData[`${name+k}_G`]
                island.fundraisers[k].deadline = scData[`${name+k}_D`]
                island.fundraisers[k].address = scData[`${name+k}_F`]
                island.fundraisers[k].raised = scData[`${name+k}_R`]
                //etc
            
         
          k++;
        }
        if(exists){
            await Island.updateOne({ name: name }, { $set: island });
        }
        else{
            island.save()
        }
        
        islands.push(island)
        
        

    //if name exists in db
            //let island = copy from db
           //if scData[name_M] != db
                    //update island.M
                    //pull from ipfs
                    //updata island.bio, island.image etc
            //check for bounties
                //at each step in loop, compare island.bounties.length with i, if i is greater or equal then fetch from ipfs
                //let bounty = new Object
                // bounty.bm doesn't change
                //bounty.treasure = scData[name0_T] etc
                //island.bounties[i] = bounty
            //check for fundraisers
                //at each step in loop, compare island.fundraisers.length with i, if i is greater or equal then fetch from ipfs
                //let fundraiser = new Object
                // fundraiser.sm doesn't change
                //fundraiser.goal = scData[name0_G] etc






   /*  let island = new Object(
        {
            "name":name,
            
        }
    ) */}
    res.send(islands)
}

module.exports = parseIslands