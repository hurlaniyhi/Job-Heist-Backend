const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    Fullname: {
        type: String
    },
    Username: {
        type: String
    },
    Email: {
        type: String
    },
    Website: {
        type: String
    },
    Password: {
        type: String
    },
    DateOfBirth: {
        type: String
    },
    Gender: {
        type: String
    },
    Address: {
        type: String
    },
    Country: {
        type: String
    },
    State: {
        type: String
    },
    Status: {
        type: String
    },
    NYSC: {
        type: String
    },
    PhoneNumber: {
        type: Number
    },
    HomeNumber: {
        type: Number
    },
    Institution: {
        type: String
    },
    ClassOfDegree: {
        type: String
    },
    Course: {
        type: String
    },
    Experience: {
        type: String
    },
    Employers: {
        type: String
    },
    JobRole: {
        type: String
    },
    AboutYou: {
        type: String
    },
    MailSubject: {
        type: String
    },
    ComposedMail: {
        type: String
    },
    NyscFile: {
        type: String
    },
    CV: {
        type: String
    },
    SchoolCert: {
        type: String
    },
    Waec: {
        type: String
    },
    Picture: {
        type: String
    },
    
})




mongoose.model('User',userSchema )