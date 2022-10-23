const Island = require('../models/island')

async function AddFundraiser(fundraiser){
    const existing = await Island.find({name:fundraiser.island})
    
    if(existing.length==1){
        
        existing[0].fundraisers.push(fundraiser)
        existing[0].save()
    }
    
   
}

module.exports = AddFundraiser