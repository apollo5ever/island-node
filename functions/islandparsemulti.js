const Island = require('../models/island')
const hex2a = require('./hex2a')
const fetch = require('node-fetch-commonjs');

async function parseIslands (req,res,next) {
    console.log("parsing island")
    let islands = []
    let names = req.names
    console.log("names",names)
    console.log("islands",islands)
    let scData = req.scData
    for(let q = 0; q<req.islands.length; q++){
        console.log("q",q,req.islands.length)
    let name = req.islands[q].name
    let scid = req.islands[q].scid
    let island = await Island.findOne({ scid: scid });
    let exists = true
    if(!island){
        console.log("no island found")
         island = new Island({scid:scid,name:name})
         exists = false

    }
        if(req.islands[q].M != island.M){
            console.log("island?",island)
            island.M = req.islands[q].M
            // pull from ipfs
            const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${island.M}`,{
                method: 'POST'
            
            })
            
            const data = await response.json()
            console.log(data)
            //update island.bio etc
            island.bio = data.bio
            island.image = data.image
            island.tagline = data.tagline
            
        }
        // old way of getting subs data. new way needs new contract
      /*   for(let j =0; j<island.tiers.length; j++){
            island.tiers[j].available = scData[`${name+j}_Av`]
            island.tiers[j].amount = scData[`${name+j}_Am`]
            island.tiers[j].address = scData[`${name+j}_Ad`]
            island.tiers[j].interval = scData[`${name+j}_I`]
            island.tiers[j].island=name
        } */
        let i = 0;
        console.log("i reset??")
        while (req.bounties[`${island.scid+i}_bm`]) {
            console.log("i",i,"bm",hex2a(req.bounties[`${island.scid+i}_bm`]),"length",island.bounties.length)
            if(i>=island.bounties.length){
                //pull from ipfs
                fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(req.bounties[`${island.scid+i}_bm`])}`,{
              method: 'POST'
          })
          const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(req.bounties[`${island.scid+i}_bm`])}`,{
            method: 'POST'
        
        })
        
        const data = await response.json()
        console.log("bounty data",data)
                island.bounties.push(new Object({
                    "bm":hex2a(req.bounties[`${island.scid+i}_bm`]),
                    "name":data.name,
                    "tagline": data.tagline,
                    "description":data.description,
                    "image":data.image,
                    "index":i,
                    "island":name
                }))
            }
                island.bounties[i].treasure = req.bounties[`${island.scid+i}_T`]
                island.bounties[i].expiry = req.bounties[`${island.scid+i}_E`]
                //etc
                console.log("hello",i)
                i=i+1
                console.log("goobye",i)
         
          
        }

        let j = 0;
        
        while (req.subscriptions[`${island.scid+j}_m`]) {
            console.log("getting subscriptions",req.subscriptions)
            
                //pull from ipfs
                fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(req.subscriptions[`${island.scid+j}_m`])}`,{
              method: 'POST'
          })
          const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(req.subscriptions[`${island.scid+j}_m`])}`,{
            method: 'POST'
        
        })
        
        const data = await response.json()
        console.log("tier data",data)
        if(j>=island.tiers.length){
                island.tiers.push(new Object())
            }
              island.tiers[j].m = hex2a(req.subscriptions[`${island.scid+j}_m`])
                island.tiers[j].name = data.name
                island.tiers[j].perks = data.perks
                island.tiers[j].image = data.image
                island.tiers[j].posts = data.posts
                island.tiers[j].subs = data.subs
                island.tiers[j].island = name
                island.tiers[j].amount = req.subscriptions[`${island.scid+j}_Am`]
                island.tiers[j].interval = req.subscriptions[`${island.scid+j}_I`]
                //etc
                
               j++
                
         
          
        }

         let k = 0;
        while (req.fundraisers[`${island.scid+k}_sm`]) {
            if(k>=island.fundraisers.length){
                //pull from ipfs
                fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(req.fundraisers[`${island.scid+k}_sm`])}`,{
                    method: 'POST'
                })
                const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(req.fundraisers[`${island.scid+k}_sm`])}`,{
                  method: 'POST'
              
              })
              
              const data = await response.json()
                island.fundraisers.push(new Object({
                    "sm":hex2a(req.fundraisers[`${island.scid+k}_sm`]),
                    "name":data.name,
                    "tagline":data.tagline,
                    "index":k,
                    "description":data.description,
                    "image":data.image,
                    "island":name
                }))
            }
                island.fundraisers[k].goal = req.fundraisers[`${island.scid+k}_G`]
                island.fundraisers[k].deadline = req.fundraisers[`${island.scid+k}_D`]
                island.fundraisers[k].address = req.fundraisers[`${island.scid+k}_F`]
                island.fundraisers[k].raised = req.fundraisers[`${island.scid+k}_R`]
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