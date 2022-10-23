const Island = require('../models/island')

async function AddBounty(bounty){
    const existing = await Island.find({name:bounty.island})
    
    if(existing.length==1){
        if(existing[0].bounties.length<=bounty.index){
            existing[0].bounties.push(bounty)
            existing[0].save()
        }
        
    }
    
   
}

module.exports = AddBounty