const Island = require('../models/island')

async function AddFundraiser(fundraiser,island){
    const existing = await Island.find({name:island})
    
    if(existing.length==1){
        
        existing[0].fundraisers.push(fundraiser)
        existing[0].save()
    }
    
   
}

module.exports = AddFundraiser