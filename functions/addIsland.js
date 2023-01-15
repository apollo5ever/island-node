const Island = require('../models/island')
const bunyan = require('bunyan');

const log = bunyan.createLogger({
    name: "island-node",
    streams: [
        {
            level:'debug',
            type: 'rotating-file',
            path: 'island-updates.log',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }
    ]
});


async function AddIsland(island) {
    try {
        const existing = await Island.findOne({ name: island.name });
        if (!existing) {
            const newIsland = new Island(island);
            await newIsland.save();
            log.debug(`Adding new island, ${island.name}.`);
        } else {
            await Island.updateOne({ name: island.name }, { $set: island });
            log.debug(`Updating existing island, ${island.name}.`);
        }
    } catch (error) {
        log.error(`Error updating island ${island.name}`, error);
    }
}



module.exports = AddIsland