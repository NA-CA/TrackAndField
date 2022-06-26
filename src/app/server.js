'use strict'; 

const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var crypto = require('crypto');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


const secretKey = 'usersecretkey';

const db = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user:'root',
    password: 'password',
    database: 'trackandfield'
}); 

db.connect((err) => {
    if (err) 
    {
        throw err; 
    }
    console.log('mysql connected...');

});

const app = express();


const cors=require("cors");
const { callbackify } = require('util');
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// sign up headCoach
app.post('/headCoach', (req,res, user) =>{

    let stringToEncrypt = req.body.password;
    let encrypted = encrypt(stringToEncrypt); 

    let post = {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, username: req.body.username, password: encrypted,  role: 'h'}; 
    let sql = 'insert into users set ?';
    let query = db.query(sql, post, (err,result) => { 

        res.send(result); 

    });
});

// sign up Coach
app.post('/coach', (req,res, user) =>{

    let stringToEncrypt = req.body.password;
    let encrypted = encrypt(stringToEncrypt); 

    let post = {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, username: req.body.username, password: encrypted,  role:'c'}; 
    let sql = 'insert into users set ?';
    let query = db.query(sql, post, (err,result) => { 

        res.send(result); 

    });
});

// sign up athlete
app.post('/athlete', (req,res, user) =>{

    //------------
    //let encrypt1 = encrypt('testtest'); 
    //console.log(encrypt1 + 'encrypt1'); 

    //let decrypt1 = decrypt(encrypt1); 
    //console.log(decrypt1 + 'decrypt1'); 

    //----------

    let stringToEncrypt = req.body.password;

    let encrypted = encrypt(stringToEncrypt); 

    let decrypted = decrypt(encrypted); 

    let post = {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, username: req.body.username, password: encrypted, gender: req.body.gender,
        grade: req.body.grade, role: 'a'}; 

    let sql = 'insert into users set ?';

    let query = db.query(sql, post,(err,result) => { 

        if (err)
        {
            res.send(result);  
        }
        else
        { 
            let sql = `select id from users order by id desc limit 1`; 
            let query2 = db.query(sql, (err,results) => {

            res.send(result); 

            });
        }
    });



}); 

// insert events 

app.post('/events', (req,res, user) =>{

    let post = {event_group: req.body[0].a, event_name: req.body[0].b}; 
    let sql = 'insert into events set ?';
    let query = db.query(sql, post, (err,result) => { 

        res.send(result); 

    });
});

// delete event 
app.post('/deleteEvent', (req,res, user) =>{

    let sql = `delete from events where event_id= '${req.body.id}'`; 
    let query = db.query(sql, (err,result) => { 

        res.send(result); 

    });

});

// select chosen meets

app.get('/prePopulateMeet', (req, res, user) => {
    
    let sql = `select * from meets where meet_id = '${req.query.meetId}'`; 
    let query = db.query(sql, (err,result) => { 

        res.send(result); 

    });
})

// delete meets 
app.post('/deleteMeet', (req, res, user) => {
    let sql = `delete from meets where meet_id= '${req.body.id}'`; 
    let query = db.query(sql, (err,result) => { 

        res.send(result); 
    });
})

// addREquest

app.post('/addRequest', (req,res, user) =>{

    let post = {athlete_ID: req.body.athleteId, req_date: req.body.currDate, req_status: req.body.reqStatus, athlete_division: req.body.athleteDivision}; 
    let sql = 'insert into requests set ?'; 
    let query = db.query(sql, post, (err,result) => { 
        res.send(err); 

    });
});

// update requests

app.post('/updateRequests', (req,res, user) =>{
 


    let sql = `select email from users where users.id = ${req.body.id}`; 
    console.log(sql + 'sqlresult'); 
    let query = db.query(sql, (err, result) => {

        console.log(result + 'result'); 

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'trackandfieldishealthy@gmail.com',
              pass: 'znswslsbrzpducjy'
            }
          });
          
          var mailOptions = {
            from: 'trackandfieldishealthy@gmail.com',
            to: result[0].email,
            subject: 'Your track and field request',
            text: 'Dear Athlete, \nYour request to join the HS track and field has been approved. '
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            } else {
            }
          });
    }); 

    let updateRequest = {req_status: 'A', approve_date: req.body.currDate};   
    let sql1 = `update requests set ? where requests.id = ${req.body.id}`; 
    
    let query1 = db.query(sql1, updateRequest, (err,result) => { 

        res.send(result); 

    });
});


app.post('/myInfo', (req,res, user) =>{

    let post = {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, id: req.body.userId};   
    let sql = `update users set ? where users.id = '${req.body.userId}'`; 
    
    let query = db.query(sql, post, (err,result) => { 

        res.send(err); 

    });
});

// updates myInfo

app.get('/updateMyInfo', (req, res, user) => {
    
    let sql = `select * from users where username = '${req.query.username}'`;
    let query = db.query(sql, (err,result) => { 

        res.send(result); 

    });
    
})

// inseret meets

app.post('/meets', (req, res, user) => {
    let post = {meet_date: req.body.date, meet_location: req.body.location, meet_time: req.body.time};
    let sql = 'insert into meets set ?'; 

    let query = db.query(sql, post, (err,result) => { 
        res.send(result); 


    });
})

// updates meets 

app.post('/updateMeet', (req, res, user) => {
    let post = {meet_location: req.body.location, meet_time: req.body.time, meet_date: req.body.date};
    let sql = `update meets set ? where meets.meet_id = '${req.body.meetId}'`; 

    let query = db.query(sql, post, (err,result) => { 

        res.send(err); 

    });
})

// gets firstname lastname from chat 

app.get('/chatFirstNameLastName', (req, res, user) => {

   let sql = `select * from users where id = '${req.query.id}'`;
   let query = db.query(sql,(err,result) => { 

    res.send(result); 

});
})


// inserts into chat 

app.post('/chat', (req, res, user) => {
    let post = {chat_datetime: req.body.currDate, chat_text: req.body.chat, user_id: req.body.userId, first_name: req.body.firstName, last_name: req.body.lastName};
    let sql = 'insert into chat set ?'; 

    let query = db.query(sql, post, (err,result) => { 

        res.send(result); 

    });
})

// updates chat 

app.post('/updateChat', (req, res, user) => {

    let post = {chat_text: req.body.chatText};
    let sql = `update chat set ? where chat.chat_id = '${req.body.chatId}'`;
    let query = db.query(sql, post, (err,result) => { 

        res.send(result); 

    });
})

// deletes chat 
app.post('/deleteChat', (req, res, user) => {
    let sql = `delete from chat where chat_id= '${req.body.id}'`; 
    let query = db.query(sql, (err,result) => { 

        res.send(result); 

    });
})

// selects chat to displauy
app.get('/getChat', (req, res) => {

    let sql = `select  * from chat`;
    let query = db.query(sql, (err,results) => {

        res.send(results); 

    });

})

// checks if meets exist 

app.get('/meetsExist', (req, res) => {

    let sql = `select  * from meets order by meet_date`;
    let query = db.query(sql, (err,results) => {

        res.send(results); 

    });

})

// select correct athlete when they are approved 
app.get('/getAthleteToApprove', (req, res) => {

    let sql = `select u.lastname, u.firstname, u.id, r.req_date from users u, requests r where r.athlete_id = u.id AND req_status = 'P' `; 
    let query = db.query(sql, (err,results) => {
        
        res.send(results); 
        
    });

})


// gets athlete id 
app.get('/getAthleteId', (req,res) => {
    
    let sql = `select id from users order by id desc limit 1`; 

    let query = db.query(sql, (err,results) => {
        
        res.send(results); 
        
    });
    
})

// checks if username exists already 

app.get('/usernameExist', (req,res) => {

    try {

        let sql = `select id from users where username = '${req.query.username}'`;
        let query = db.query(sql, (err,results) => {  

            res.send(results);
            
        });
    }
    catch(e)
    {
        res.send(e); 

    }
    
    
})

// checks if exents exists 

app.get('/eventsExist', (req,res) => {

    let sql = `select  * from events`;
    let query = db.query(sql, (err,results) => {

        res.send(results); 
        

    });
    
})

// gets user with username and password 

app.get('/getUser', (req,res) => {

    let sql = `select  role from users where username = '${req.query.username}' and password = '${req.query.password}'`;
    let query = db.query(sql, (err,results) => {

        if (Object.keys(results).length == 0)
        {
            res.send(results);
        }
        else {
            res.send(results[0]);
        }
        

    });
    
})

// gets headcoachInfo 

app.get('/headCoachInfo', (req,res) => {
    
    let sql = 'select  * from users';
    let query = db.query(sql, (err,results) => {

        if (err)
        {
            res.send(err);  
        }
        else {
            res.send(results);
        }

    });
})

// allows user to sign in 
app.post('/signIn', (req,res) => {

    console.table(req.body.password + 'body'); 

    var pwd = ''; 

    var encryptedPwd = ''; 


    try
    {
        let sql1 = `select  * from users where username = '${req.body.username}'`;

        let query1 = db.query(sql1, (err,results) => 
        {


            
        if (Object.keys(results).length == 0)
        {
            res.send(err); 
        }
        else
        {
            console.log('test'); 
            pwd = results[0].password;

            //console.log(pwd + 'pwd'); 

            //let encrypted = encrypt(req.body.password); 
            //console.log(encrypted + 'encrypted'); 

            let decrypted = decrypt(pwd); 
            //console.log(decrypted + 'decrypted'); 

            if (decrypted == req.body.password)
            {
            let sql = `select  * from users where username = '${req.body.username}'`;

            console.log(sql + 'sql');

            let query = db.query(sql, (err,results) => 
            {

                if (Object.keys(results).length == 0)
                {
                    res.send(err); 
                }
                else 
                {
        
                    var token = jwt.sign({ id: results.id }, 'usersecretkey', {
                        expiresIn: 86400 // 24 hours
                      });
        
                      var userTokenInfo = {id: results[0].id,
                        username: results[0].username,
                        role: results[0].role,
                        accessToken: token}; 

                      res.send(userTokenInfo); 
                }
            });
            }
            else
            {
                res.send(null); 
            }
        }
        
        });
    }
    catch(e)
    {
        res.send(e); 

    }
    
});


app.listen('3000', () =>{
    console.log('server started on port 3000'); 
});

// encrypts password 

function encrypt(text) {

    let cipher =
     crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    
    let encrypted = cipher.update(text);
    
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// decrypts password 
function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
   
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
   }