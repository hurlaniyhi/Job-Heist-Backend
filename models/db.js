const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/JobHeist', {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    //mongodb://localhost:27017/Request
    //mongodb+srv://olaniyi:ridwan152@cluster0-kezbp.mongodb.net/test?retryWrites=true&w=majority
    if(!err){
        console.log('mongodb successfully connected')
    }
    else{
        console.log("error in DB connection")
    }
})

require('./user.model.js')