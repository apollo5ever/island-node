const Island = require('../models/island')

async function AddBounty(bounty,island,index){
    const existing = await Island.find({name:island})
    
    if(existing.length==1){
        if(existing[0].bounties.length<=index){
            existing[0].bounties.push(bounty)
            existing[0].save()
        }
        
    }
    
   
}

module.exports = AddBounty