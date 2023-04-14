const express = require('express')
const router = express.Router()
const Island = require('../models/island')
const makeIntegrated = require('../functions/makeIntegrated')
const parseIsland = require('../functions/islandparse')
const getSC = require('../functions/getSC')
const parseIslands = require('../functions/islandparsemulti')


// Getting all
router.get('/',getSC,parseIslands, async (req, res) => {
   res.json()
})

// Getting all bounties
router.get('/bounties', async (req, res) =>{
    try {
        var bounties = []
        const islands = await Island.find()
        for(var i=0;i<islands.length;i++){
            for(var b=0;b<islands[i].bounties.length;b++){
                bounties.push(islands[i].bounties[b])
            }
        }
        res.json(bounties)
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

router.get('/fundraisers', async (req, res) =>{
    try {
        var fundraisers = []
        const islands = await Island.find()
        for(var i=0;i<islands.length;i++){
            for(var b=0;b<islands[i].fundraisers.length;b++){
                fundraisers.push(islands[i].fundraisers[b])
            }
        }
        res.json(fundraisers)
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

//Getting One
router.get('/:name', getSC,parseIsland,(req,res,next) => {
res.json()


})

//make integrated address
router.get('/integrate/:address/:tier',makeIntegrated,(req,res,next)=>{
       res.json()
})


module.exports = router