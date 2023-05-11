const mongoose = require('mongoose')

const islandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scid: {
        type: String,
        require: true
    },
    tagline: {
        type: String,
        required: false
    },
    bio: {
        type:String,
        required:false
    },
    image: {
        type:String,
        required:false
    },
    tiers: {
        type:Array,
        required:true,
        default: []
    },
    bounties: {
        type:Array,
        required: true,
        default:[]
    },
    fundraisers: {
        type:Array,
        required: true,
        default:[]
    },
    M: {
        type: String,
        required: true,
        default:""
    }
})

module.exports = mongoose.model('Island',islandSchema)