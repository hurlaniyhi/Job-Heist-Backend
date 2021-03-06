const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const multer = require('multer')
const path = require("path")

const GridFsStorage = require("multer-gridfs-storage")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



mongoose.set('useFindAndModify', false);
const User = mongoose.model('User')
const router = express.Router()


var minisave = []

const mongoURI = "mongodb://localhost:27017/node-file-upl";
// mongodb+srv://ridwan:ridwan526@ridwanlock-uqlxu.mongodb.net/test?retryWrites=true&w=majority
// connection
// mongodb://localhost:27017/node-file-upl
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

var storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        
        console.log(file.fieldname)
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          
          
          minisave.push(filename)
          console.log(minisave[minisave.length-1])
          
          
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"

          };
          resolve(fileInfo);


        });
      });
    }
  });
  
  const upload = multer({
    storage
  });


  

router.post('/signup',(req,res)=>{
    if(req.body.Username.includes(" ")){
        console.log("Username should not have space")
      res.send("Username should not have space")
    }
    else{
    User.findOne({$or:[{Username: req.body.Username},{Email: req.body.Email}]},function(err, doc){
        
        
        if(doc){
            console.log("user already exist")
            res.send("User already exist")
            
        }
        else{
            insertRecord(req,res)
        }
        
})
    }
})

function insertRecord(req,res){
    var user = new User();
    user.Fullname = req.body.Fullname
    user.Username = req.body.Username
    user.Password = req.body.Password
    user.Email = req.body.Email
    user.Website = req.body.Website
    user.save((err, docs)=>{
        if (!err){
            console.log(docs)
            console.log("user successfully created")
            res.send("good")
        }
        else{
            res.send("Server Error")
            console.log("Error occur during insertion")
        }
    }) 
}



router.post('/signin',(req,res)=>{
    
   
    if(req.body.Username[req.body.Username.length-1] == " "){
        req.body.Username = req.body.Username.replace(req.body.Username[req.body.Username.length-1],"")
    }
    User.findOne({Username: req.body.Username, Password: req.body.Password},function(err, doc){
            
        if(doc){
           
            
            if(doc.Website != ""){
                console.log("requiter dashboard")
                res.json({
                    "nav": "requiter",
                    "Id": doc._id
                })
            }
            else{
                console.log("jobseeker dashboard")
                res.json({
                    "nav": "jobseeker",
                    "Id": doc._id
                })
        }
        
        }
        else{
            console.log("incorrect password or username")
            res.send("Incorrect password or username")
        }
        
})

})

router.post('/fetchInfo',(req,res)=>{
    User.findOne({Username: req.body.Username},function(err, doc){
        if(doc){
            console.log("good")
            
            res.send(doc)
            
        } 
        else{
            res.send("bad")
        }
    })
})


router.post('/editProfile',(req,res)=>{
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: req.body.Fullname,
                DateOfBirth: req.body.DateOfBirth,
                Email: req.body.Email,
                Gender: req.body.Gender,
                Address: req.body.Address,
                Country: req.body.Country,
                State: req.body.State,
                Status: req.body.Status,
                NYSC: req.body.NYSC,
                PhoneNumber: req.body.PhoneNumber,
                HomeNumber: req.body.HomeNumber,
                Institution: req.body.Institution,
                Course: req.body.Course,
                ClassOfDegree: req.body.ClassOfDegree,
                Experience: req.body.Experience,
                Employers: req.body.Employers,
                JobRole: req.body.JobRole,
                AboutYou: req.body.AboutYou,
                NyscFile: doc.NyscFile,
                CV: doc.CV,
                SchoolCert: doc.SchoolCert,
                Waec: doc.Waec,
                Picture: doc.Picture
            }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
        
})

})


router.post("/CV", upload.single("CV"),(req,res)=>{
    
    updateCV(req,res)
    
})

function updateCV(req,res){
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: doc.Fullname,
                DateOfBirth: doc.DateOfBirth,
                Email: doc.Email,
                Gender: doc.Gender,
                Address: doc.Address,
                Country: doc.Country,
                State: doc.State,
                Status: doc.Status,
                NYSC: doc.NYSC,
                PhoneNumber: doc.PhoneNumber,
                HomeNumber: doc.HomeNumber,
                Institution: doc.Institution,
                Course: doc.Course,
                ClassOfDegree: doc.ClassOfDegree,
                Experience: doc.Experience,
                Employers: doc.Employers,
                JobRole: doc.JobRole,
                AboutYou: doc.AboutYou,
                NyscFile: doc.NyscFile,
                CV: minisave[minisave.length-1],
                SchoolCert: doc.SchoolCert,
                Waec: doc.Waec,
                Picture: doc.Picture
            }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs.CV)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
    
})
}


router.post("/SchoolCert",upload.single("SchoolCert"),(req,res)=>{
    
    updateResult(req,res)
    
})

function updateResult(req,res){
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: doc.Fullname,
                DateOfBirth: doc.DateOfBirth,
                Email: doc.Email,
                Gender: doc.Gender,
                Address: doc.Address,
                Country: doc.Country,
                State: doc.State,
                Status: doc.Status,
                NYSC: doc.NYSC,
                PhoneNumber: doc.PhoneNumber,
                HomeNumber: doc.HomeNumber,
                Institution: doc.Institution,
                Course: doc.Course,
                ClassOfDegree: doc.ClassOfDegree,
                Experience: doc.Experience,
                Employers: doc.Employers,
                JobRole: doc.JobRole,
                AboutYou: doc.AboutYou,
                NyscFile: doc.NyscFile,
                CV: doc.CV,
                SchoolCert: minisave[minisave.length-1],
                Waec: doc.Waec,
                Picture: doc.Picture
            }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs.SchoolCert)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
    
})
}


router.post("/Waec", upload.single("Waec"),(req,res)=>{
    
    updateWaec(req,res)
    
})

function updateWaec(req,res){
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: doc.Fullname,
                DateOfBirth: doc.DateOfBirth,
                Email: doc.Email,
                Gender: doc.Gender,
                Address: doc.Address,
                Country: doc.Country,
                State: doc.State,
                Status: doc.Status,
                NYSC: doc.NYSC,
                PhoneNumber: doc.PhoneNumber,
                HomeNumber: doc.HomeNumber,
                Institution: doc.Institution,
                Course: doc.Course,
                ClassOfDegree: doc.ClassOfDegree,
                Experience: doc.Experience,
                Employers: doc.Employers,
                JobRole: doc.JobRole,
                AboutYou: doc.AboutYou,
                NyscFile: doc.NyscFile,
                CV: doc.CV,
                SchoolCert: doc.SchoolCert,
                Waec:  minisave[minisave.length-1],
                Picture: doc.Picture
            }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs.Waec)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
    
})
}


router.post("/Nysc",upload.single("NyscFile"),(req,res)=>{
    
    updateNysc(req,res)
    
})

function updateNysc(req,res){
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: doc.Fullname,
                DateOfBirth: doc.DateOfBirth,
                Email: doc.Email,
                Gender: doc.Gender,
                Address: doc.Address,
                Country: doc.Country,
                State: doc.State,
                Status: doc.Status,
                NYSC: doc.NYSC,
                PhoneNumber: doc.PhoneNumber,
                HomeNumber: doc.HomeNumber,
                Institution: doc.Institution,
                Course: doc.Course,
                ClassOfDegree: doc.ClassOfDegree,
                Experience: doc.Experience,
                Employers: doc.Employers,
                JobRole: doc.JobRole,
                AboutYou: doc.AboutYou,
                NyscFile: minisave[minisave.length-1],
                CV: doc.CV,
                SchoolCert: doc.SchoolCert,
                Waec: doc.Waec,
                Picture: doc.Picture
            }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs.NyscFile)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
    
})
}


 
router.post('/Picture',(req,res)=>{
    storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads/')
        },
        filename: function(req, file, cb){
            console.log(file)
            cb(null, file.originalname)
        }
    })   
    
 const upload = multer({storage}).single('Picture')
 upload(req, res, function(err){
     if(err){
         return res.send(err)
     }
     console.log("file uploaded to server")
     console.log(req.file)
     

     const cloudinary = require('cloudinary').v2
     cloudinary.config({
         cloud_name: 'dcx4utzdx',
         api_key: '226791946435464',
         api_secret: 'yzsp3pOrvIEzFAhfMfWEIWXQmmA'
     })
     console.log("welcome to cloudinary")
     const path = req.file.path
    
     const uniqueFilename = new Date().toISOString()

     cloudinary.uploader.upload(
         path,
         {
             public_id: `blog/${uniqueFilename}`, tags: `blog`
         },
         function(err, image){
             if(err) return console.log(err)
             console.log("file uploaded to cloudinary")

             const fs = require('fs')
             fs.unlinkSync(path)
             console.log(image)
            //localsave.passport = image.secure_url


            User.findOne({_id: req.body.Id},function(err, doc){
        
        
                if(doc){
        
                    User.findByIdAndUpdate({_id: req.body.Id}, {
                        _id: doc._id,
                        Username: doc.Username,
                        Password: doc.Password,
                        Website: doc.Website,
                        Fullname: doc.Fullname,
                        DateOfBirth: doc.DateOfBirth,
                        Email: doc.Email,
                        Gender: doc.Gender,
                        Address: doc.Address,
                        Country: doc.Country,
                        State: doc.State,
                        Status: doc.Status,
                        NYSC: doc.NYSC,
                        PhoneNumber: doc.PhoneNumber,
                        HomeNumber: doc.HomeNumber,
                        Institution: doc.Institution,
                        Course: doc.Course,
                        ClassOfDegree: doc.ClassOfDegree,
                        Experience: doc.Experience,
                        Employers: doc.Employers,
                        JobRole: doc.JobRole,
                        AboutYou: doc.AboutYou,
                        NyscFile: doc.NyscFile,
                        CV: doc.CV,
                        SchoolCert: doc.SchoolCert,
                        Waec: doc.Waec,
                        Picture: image.secure_url
                    }, 
                    {new: true}, (err,docs)=>{
        
                    if (!err){
                    console.log("successfully updated")
                    console.log(docs.Picture)
                    console.log(typeof(docs.Picture))
                    res.send("good")
                    }
                   else{
                    console.log("error occur during update")
                    res.send("bad")
                    }
                    
                })
                    
                }
                else{
                    console.log('cannot find document in the database')
                    res.send("could not find your profile in the database")
                }
            
        })


         }
     )
 }
 )


})




// router.post("/Picture",(req,res)=>{
    
//     updateProfilePicture(req,res)
    
// })

// function updateProfilePicture(req,res){
//     User.findOne({_id: req.body.Id},function(err, doc){
        
        
//         if(doc){

//             User.findByIdAndUpdate({_id: req.body.Id}, {
//                 _id: doc._id,
//                 Username: doc.Username,
//                 Password: doc.Password,
//                 Website: doc.Website,
//                 Fullname: doc.Fullname,
//                 DateOfBirth: doc.DateOfBirth,
//                 Email: doc.Email,
//                 Gender: doc.Gender,
//                 Address: doc.Address,
//                 Country: doc.Country,
//                 State: doc.State,
//                 Status: doc.Status,
//                 NYSC: doc.NYSC,
//                 PhoneNumber: doc.PhoneNumber,
//                 HomeNumber: doc.HomeNumber,
//                 Institution: doc.Institution,
//                 Course: doc.Course,
//                 ClassOfDegree: doc.ClassOfDegree,
//                 Experience: doc.Experience,
//                 Employers: doc.Employers,
//                 JobRole: doc.JobRole,
//                 AboutYou: doc.AboutYou,
//                 NyscFile: doc.NyscFile,
//                 CV: doc.CV,
//                 SchoolCert: doc.SchoolCert,
//                 Waec: doc.Waec,
//                 Picture: req.body.Picture
//             }, 
//             {new: true}, (err,docs)=>{

//             if (!err){
//             console.log("successfully updated")
//             console.log(docs.Picture)
//             console.log(typeof(docs.Picture))
//             res.send("good")
//             }
//            else{
//             console.log("error occur during update")
//             res.send("bad")
//             }
            
//         })
            
//         }
//         else{
//             console.log('cannot find document in the database')
//             res.send("could not find your profile in the database")
//         }
    
// })
// }



router.get("/file/:filename", (req, res) => {

    console.log("good")

    const file = gfs
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        } 
        else{
            console.log("found")
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        }
      });
      
    
  })

  router.post('/search', (req,res)=>{
      console.log(req.body.CourseOfStudy)
      console.log(req.body.ClassOfDegree)
    User.find({Course: req.body.CourseOfStudy, ClassOfDegree: req.body.ClassOfDegree},function(err, doc){
        
        if(doc){
            console.log(doc)
            res.json({
                "comment": "good",
                "list": doc
            })
        }
        else{
            res.json({
                "comment": "bad",
                "list": "No document match"
            })
        }
    })
  })


  router.post('/sendMail',(req,res)=>{
    User.findOne({Username: req.body.Username},function(err, doc){
        if(!doc){
           
            res.send("requiter is not found in the database")

    }  else{

    
          
    let transporter = nodemailer.createTransport({
     
     service: 'gmail',
      auth: {
        user: 'olaniyi.jibola152@gmail.com',
        pass: 'ridwan526'
      },

    });
    console.log(doc)
    
    let mailOptions = {
      from: 'fintech.request@gmail.com', 
      to: req.body.sendTo, 
      subject: doc.MailSubject, 
      text: `hi, ${doc.ComposedMail}.`
    
    };
  

    transporter.sendMail(mailOptions, (error,info)=>{
        
      if(error){
          return console.log(error)
      } 

      console.log("Message sent: %s", info.messageId);

      
      res.json({
        "comment": "good",
       
    })
    
    })
}
            
  })
})

router.post('/compose',(req,res)=>{
    console.log(req.body.ComposedMail)
    User.findOne({_id: req.body.Id},function(err, doc){
        
        
        if(doc){

            User.findByIdAndUpdate({_id: req.body.Id}, {
                _id: doc._id,
                Username: doc.Username,
                Password: doc.Password,
                Website: doc.Website,
                Fullname: doc.Fullname,
                Email: doc.Email,
                MailSubject: req.body.MailSubject,
                ComposedMail: req.body.ComposedMail
                }, 
            {new: true}, (err,docs)=>{

            if (!err){
            console.log("successfully updated")
            console.log(docs)
            res.send("good")
            }
           else{
            console.log("error occur during update")
            res.send("bad")
            }
            
        })
            
        }
        else{
            console.log('cannot find document in the database')
            res.send("could not find your profile in the database")
        }
        
})

})


router.get("/file/:filename", (req, res) => {
     console.log('id', req.params.id)
    const file = gfs
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        }
        else{
            console.log("found")
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        }
      });
  });


module.exports = router