const Island = require('../models/island')

async function AddFundraiser(fundraiser,island,index){
    const existing = await Island.find({name:island})
    
    if(existing.length==1){
        if(existing[0].fundraisers.length<=index){
	fundraiser.island=island
        fundraiser.index=index
        existing[0].fundraisers.push(fundraiser)
        existing[0].save()
        }
    }
    
   
}

module.exports = AddFundraiser
