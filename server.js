require('./models/db.js');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const handler = require('./handlers/controller.js')


const app = express()
var port = process.env.PORT || 3001


app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())

app.use('/', handler)


app.listen(port,()=>{
    console.log("server is running on port 3001")
})