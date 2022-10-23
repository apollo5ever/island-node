const Island = require('../models/island')

async function AddIsland(island){
    const existing = await Island.find({name:island.name})
    
    if(existing.length==0)
    {
        const islandObj = new Island({
            name:island.name,
            tagline: island.tagline,
            bio: island.bio,
            image: island.image,
            tiers: island.tiers
        })
    
        const newIsland = await islandObj.save()
    }else{
        existing[0].tagline = island.tagline
        existing[0].bio = island.bio
        existing[0].image=island.image
        existing[0].tiers = island.tiers
        existing[0].save()
    }
    
   
}

module.exports = AddIsland