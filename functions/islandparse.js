const Island = require('../models/island')
const hex2a = require('./hex2a')
const fetch = require('node-fetch-commonjs');

async function parseIsland (req,res,next) {
    console.log("parsing island")
    console.log("req.islands",req.islands)
    let name = req.params.name
    let scid = hex2a(req.registry[`S::PRIVATE-ISLANDS::${name}`])
    console.log("scid",scid)
    let island = await Island.findOne({ scid: scid });
    let risland = req.islands.filter(x=>x.scid==scid)[0]
    console.log("risland",risland)
    let exists = true
    if(!island){
        console.log("no island found")
         island = new Island({scid:scid,name:name})
         exists = false

    }

     /*    if(risland.M != island.M){
            console.log("island?",island)
            island.M = risland.M
           

            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${island.M}`,{
                method: 'GET'
            })
            
            const data = await response.json()
            console.log(data)
            //update island.bio etc
            island.bio = data.bio
            island.image = data.image
            island.tagline = data.tagline
            
        } */
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
        console.log(i,req.bounties[`${island.scid+i}_version`])
        while (req.bounties[`${island.scid+i}_version`]+1) { //added +1 to make it truthy for verison 0
            let version = req.bounties[`${island.scid+i}_version`]
            //console.log("i",i,"bm",hex2a(req.bounties[`${island.scid+i}_bm`]),"length",island.bounties.length)
            if(i>=island.bounties.length){
                //pull from ipfs
            /*     fetch(`http://127.0.0.1:5001/api/v0/pin/add?arg=${hex2a(req.bounties[`${island.scid+i}_bm`])}`,{
              method: 'POST'
          })
          const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${hex2a(req.bounties[`${island.scid+i}_bm`])}`,{
            method: 'POST'
        
        })
        
        const data = await response.json()
        console.log("bounty data",data) */
                island.bounties.push(new Object({
                    "name":hex2a(req.bounties[`${island.scid+i}_name_${version}`]),
                    "index":i,
                    "island":name,
                    "judgeList":[],
                    "execList":[]
                }))
            }

           
                for(let v =0;v<=version;v++){
                    if(req.bounties[`${island.scid+i}_name_${v}`]){
                        island.bounties[i].name = hex2a(req.bounties[`${island.scid+i}_name_${v}`])
                    }
                    if(req.bounties[`${island.scid+i}_image_${v}`]){
                        island.bounties[i].image = hex2a(req.bounties[`${island.scid+i}_image_${v}`])
                    }
                    if(req.bounties[`${island.scid+i}_tagline_${v}`]){
                        island.bounties[i].tagline = hex2a(req.bounties[`${island.scid+i}_tagline_${v}`])
                    }
                    if(req.bounties[`${island.scid+i}_desc_${v}`]){
                        island.bounties[i].description = hex2a(req.bounties[`${island.scid+i}_desc_${v}`])
                    }
                }
                island.bounties[i].version = version
            //add tagline, dessc, image here
            island.bounties[i].treasure = req.bounties[`${island.scid+i}_T`]
            island.bounties[i].expiry = req.bounties[`${island.scid+i}_E`]
            island.bounties[i].JN = req.bounties[`${island.scid+i}_JN`]
            island.bounties[i].JT = req.bounties[`${island.scid+i}_JT`]
            island.bounties[i].JE = req.bounties[`${island.scid+i}_JE`]
            island.bounties[i].XN = req.bounties[`${island.scid+i}_XN`]
            island.bounties[i].XT = req.bounties[`${island.scid+i}_XT`]
            island.bounties[i].XE = req.bounties[`${island.scid+i}_XE`]
            island.bounties[i].JF = req.bounties[`${island.scid+i}_JF`]
            island.bounties[i].judgeAddress = req.bounties[`${island.scid+i}_J_address`]
            island.bounties[i].execAddress = req.bounties[`${island.scid+i}_X_address`]
            island.bounties[i].recipientList = []
            if(req.bounties[`${island.scid+i}_X`]){
                island.bounties[i].executer = new Object(
                    {
                        "name": "unregistered asset",
                        "scid":hex2a(req.bounties[`${island.scid+i}_X`])
                    }
                )
                if(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_X`])}`]){
                    island.bounties[i].executer.name = hex2a(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_X`])}`])
                }
            }

            //get confirmed judge
            if(req.bounties[`${island.scid+i}_J`]){
                island.bounties[i].judge = new Object(
                    {
                        "name": "unregistered asset",
                        "scid":hex2a(req.bounties[`${island.scid+i}_J`])
                    }
                )
                if(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_J`])}`]){
                    island.bounties[i].judge.name = hex2a(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_J`])}`])
                }
            }
             
            

            //fetch effective XN
            island.bounties[i].XNeff= parseInt((island.bounties[i].XN + 1+(new Date().getTime()/1000 - island.bounties[i].XE)/1209600)%island.bounties[i].XT)

            //fetch effect XE
            if(new Date().getTime()/1000>island.bounties[i].XE)
            {island.bounties[i].XEeff = Math.round(1209600-(new Date().getTime()/1000-island.bounties[i].XE)%1209600)
           }else island.bounties[i].XEeff = Math.round(island.bounties[i].XE-new Date().getTime()/1000)

           //fetch effective JN
           island.bounties[i].JNeff= parseInt((island.bounties[i].JN + 1+(new Date().getTime()/1000 - island.bounties[i].JE)/1209600)%island.bounties[i].JT)

           //fetch effect JE
           if(new Date().getTime()/1000>island.bounties[i].JE)
           {island.bounties[i].JEeff = Math.round(1209600-(new Date().getTime()/1000-island.bounties[i].JE)%1209600)
          }else island.bounties[i].JEeff = Math.round(island.bounties[i].JE-new Date().getTime()/1000)
            

                //get status
                if(island.bounties[i].expiry< new Date().getTime()/1000){
                    //bounty is expired
                    if(island.bounties[i].JF ==1){
                        //treasure was released
                        island.bounties[i].status = 1
                    }
                    else island.bounties[i].status = 2
                }else island.bounties[i].status =0
                

         //fetch judgeList
         for(let w=0;w<island.bounties[i].JT;w++){
            island.bounties[i].judgeList[w]=new Object(
                {
                    "scid":hex2a(req.bounties[`${island.scid+i}_J${w}`]),
                    "name":"unregistered asset"
                }
            )
            if(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_J${w}`])}`]){
                island.bounties[i].judgeList[w].name= hex2a(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_J${w}`])}`])
                    
            }
            
        }

        //fetch execList
    for(let w=0;w<island.bounties[i].XT;w++){
        island.bounties[i].execList[w]=new Object(
            {
                "scid":hex2a(req.bounties[`${island.scid+i}_X${w}`]),
                "name":"unregistered asset"
            }
        )
        if(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_X${w}`])}`]){
            island.bounties[i].execList[w].name=hex2a(req.registry[`N::PRIVATE-ISLANDS::${hex2a(req.bounties[`${island.scid+i}_X${w}`])}`])
                
        }
    }

    if(req.bounties[`${island.scid+i}_RN`]){
        for(let h=0;h<req.bounties[`${island.scid+i}_RN`];h++){
            island.bounties[i].recipientList.push(new Object({"address":hex2a(req.bounties[`${island.scid+i}_R_${h}`]),"weight":req.bounties[`${island.scid+i}_W_${h}`]}))
        }
    }
         
          i++
        }

        let j = 0;
        
        while (req.subscriptions[`${island.scid+j}_version`]+1) {
            console.log("getting subscriptions",req.subscriptions)
            let version = req.subscriptions[`${island.scid+j}_version`]
             
        if(j>=island.tiers.length){
                island.tiers.push(new Object({
                    "name": hex2a(req.subscriptions[`${island.scid+j}_name_${version}`]),
                    "index":j,
                    "island":name,
                    "scid":island.scid
                }))
            }
              
            for(let v =0;v<=version;v++){
               
                if(req.subscriptions[`${island.scid+j}_name_${v}`]){
                    island.tiers[j].name = hex2a(req.subscriptions[`${island.scid+j}_name_${v}`])
                }
                if(req.subscriptions[`${island.scid+j}_image_${v}`]){
                    island.tiers[j].image = hex2a(req.subscriptions[`${island.scid+j}_image_${v}`])
                }
                if(req.subscriptions[`${island.scid+j}_tagline_${v}`]){
                    island.tiers[j].tagline = hex2a(req.subscriptions[`${island.scid+j}_tagline_${v}`])
                }
                if(req.subscriptions[`${island.scid+j}_desc_${v}`]){
                    island.tiers[j].description = hex2a(req.subscriptions[`${island.scid+j}_desc_${v}`])
                }
            }
                
                island.tiers[j].island = name
                island.tiers[j].amount = req.subscriptions[`${island.scid+j}_Am`]
                island.tiers[j].interval = req.subscriptions[`${island.scid+j}_I`]
                island.tiers[j].available = req.subscriptions[`${island.scid+j}_Av`]
                island.tiers[j].index = j

                var supporterSearch = new RegExp(`_${island.scid+j}_E`)
                 island.tiers[j].subs=Object.keys(req.subscriptions)
                .filter(key=>supporterSearch.test(key))
                .filter(key=>req.subscriptions[key]> new Date().getTime()/1000)
                .map(x=>x.substring(0,66))
                //etc
                
               j++
                
         
          
        }

         let k = 0;
        while (req.fundraisers[`${island.scid+k}_version`]+1) {
            let version = req.fundraisers[`${island.scid+k}_version`]
            console.log("fund version ",version)
            if(k>=island.fundraisers.length){
               
              
             
                island.fundraisers.push(new Object({
                    "name":hex2a(req.fundraisers[`${island.scid+i}_name_${version}`]),
                    "index":k,
                    "island":name,
                    "scid":island.scid
                }))
            }

            for(let v =0;v<=version;v++){
                console.log(`req.fundraisers: ${req.fundraisers}`)
                console.log(` image version ${v}: ${req.fundraisers[`${island.scid+k}_image_${v}`]}`)
                if(req.fundraisers[`${island.scid+k}_name_${v}`]){
                    island.fundraisers[k].name = hex2a(req.fundraisers[`${island.scid+k}_name_${v}`])
                }
                if(req.fundraisers[`${island.scid+k}_image_${v}`]){
                    island.fundraisers[k].image = hex2a(req.fundraisers[`${island.scid+k}_image_${v}`])
                }
                if(req.fundraisers[`${island.scid+k}_tagline_${v}`]){
                    island.fundraisers[k].tagline = hex2a(req.fundraisers[`${island.scid+k}_tagline_${v}`])
                }
                if(req.fundraisers[`${island.scid+k}_desc_${v}`]){
                    island.fundraisers[k].description = hex2a(req.fundraisers[`${island.scid+k}_desc_${v}`])
                }
            }
                island.fundraisers[k].goal = req.fundraisers[`${island.scid+k}_G`]
                island.fundraisers[k].deadline = req.fundraisers[`${island.scid+k}_D`]
                island.fundraisers[k].address = hex2a(req.fundraisers[`${island.scid+k}_F`])
                island.fundraisers[k].raised = req.fundraisers[`${island.scid+k}_R`]
                //etc
            
         
          k++;
        } 
        //SOCIAL COCONUT SCORE
        ratingSearch = new RegExp(`RATING::PRIVATE-ISLANDS::${island.scid}::`)
        let ratings = Object.keys(req.registry)
        .filter(key=>ratingSearch.test(key))
        let score = 0
        for(r of ratings){
            score += Math.min(100,req.registry[r]) 
        }
        score = score/ratings.length
        island.score = score
        console.log("RATINGS: ",ratings,score)
        if(exists){
            await Island.updateOne({ scid: scid }, { $set: island });
        }
        else{
            island.save()
        }
        
        res.send(island)
        
        

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
    ) */
}

module.exports = parseIsland