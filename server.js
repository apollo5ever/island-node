require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch-commonjs');
const app = express()
const mongoose = require('mongoose')
const AddIsland = require('./functions/addIsland')
const getData = require('./functions/fetch')
const cors = require('cors')
const fs = require('fs');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "island-node-crash"});

process.on('uncaughtException', (err) => {
    log.error(err, 'uncaughtException');
    fs.writeSync(1, `Caught exception: ${err}\n`);
    process.exit(1);
});




mongoose.connect('mongodb://127.0.0.1/islands')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('Conencted to databagse'))

app.use(
	cors({
		origin: "*"
	})
)

app.use(express.json())

const islandsRouter = require('./routes/islands');
const store = require('./functions/store');
app.use('/api/islands',islandsRouter)




setInterval(getData,100000)





app.listen(5000, ()=> console.log('Server Started'))
