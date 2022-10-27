const express = require('express')
const fetch = require('node-fetch-commonjs');
const app = express()
const mongoose = require('mongoose')
const AddIsland = require('./functions/addIsland')
const getData = require('./functions/fetch')
const cors = require('cors')



mongoose.connect('mongodb://localhost/islands')
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
app.use('/islands',islandsRouter)




setInterval(getData,100000)





app.listen(5000, ()=> console.log('Server Started'))
