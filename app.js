//import
const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT||3000;
const sql = require('./db/db');
const CRUD_functions = require("./db/CRUD_functions"); 
const fs = require('fs');
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');
const CreateDB = require('./db/createBD');
var device = require('express-device');
var cookieParser = require('cookie-parser');
const { log } = require('console');

var group1Row = 1;
var group2Row = 101;
var group3Row = 201;
var group4Row = 301;

//setup
const app = express();
app.use(cookieParser())
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');
//app.use(express.static('static'));
app.use(express.static(path.join(__dirname, "public")));

//routs
app.get('/' , (req, res)=>{
  res.redirect('Login');
});

app.get('/Login' , (req, res)=>{
  res.render('Login');
});

app.get('/Risk1' , (req, res)=>{
  res.render('Risk1');
});

//listen
app.listen(port, ()=>{
  console.log("server is running on port " + port);
});

//creare, insert, delete, show DB tables
app.get('/CreateParticipantsTable',CreateDB.CreateParticipantsTable);
app.get('/InsertDataToParticipants',CreateDB.InsertDataToParticipants);
app.get('/DropTableParticipants',CreateDB.DropTableParticipants);
app.get('/ShowTable', CreateDB.ShowTable);
app.get('/CreateClicksTable', CreateDB.CreateClicksTable);
app.get('/ShowClicksTable', CreateDB.ShowClicksTable);
app.get('/DropTableClicks', CreateDB.DropTableClicks);


//get and post

//UpdateDetailes
app.post("/ExperimentEnd", CRUD_functions.UpdateParticipant);


app.get('/hello',function(req,res) {
  res.send("Hi to "+req.device.type.toUpperCase()+" User");
});
app.post("/insertClick", CRUD_functions.insertClick);


//save real user device in the participants table
/////שומר את המכשיר ומבצע בדיקה האם המכשיר הוא המכשיר המיועד + מסווג לפי קבוצת ניסוי. צריך להעביר את כל זה לתוך הפונקציה של הפורם
app.use(device.capture());
app.post('/Risk1', (req, res) => {
  const userProlificID = req.cookies.ProlificID;
  //const Usercode = req.cookies.code;
  const q = `SELECT * FROM Participants WHERE prolificID = ?`;
      sql.query(q, [userProlificID], (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
              const user = results[results.length-1];
              if (user.groupNum == 1 || user.groupNum == 3 ) { //group 1 or 3 - send to little infirmation risks
                res.render("Risk1");
              } 
              else { // group 2 or 4 - send to infirmation load risks
                res.render("Risk1-Group2"); 
              }
          }
      });
});


function checkDevice(req,res, rowNum) {
    const Usercode = req.body.code;
    const device = req.device.type.toUpperCase();
    const ProlificID = req.body.ProlificID;
    const s = 'UPDATE Participants set realDevice =? , ProlificID =? WHERE id = ?'; 
    sql.query(s, [device,ProlificID,rowNum], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.message);
            return res.status(500).json({ error: 'Error inserting data' });
        }
        const q = `SELECT * FROM Participants WHERE id = ?`;
        sql.query(q, [rowNum], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                const user = results[0];
                if(user.device == device) { //check if the user use the device that he need
                  res.render("Explanations");
                }
                else{
                  res.render("wrongDevice");
                }
            }
        });
    });

}

app.post('/Explanations', (req, res) => {
    var code = req.body.code;
    sql.query(`SELECT groupNum FROM participants WHERE code = '${code}' LIMIT 1` , (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting participant by name: " + err});
            return;
        }
        if (result.length != 0){// found the participant
            userDetails(req,res);
            if (result[0].groupNum == 1){
              saveParticipantTimeStemp(group1Row);
              checkDevice(req, res, group1Row);
              group1Row++;
            }
            if (result[0].groupNum == 2){
              saveParticipantTimeStemp(group2Row);
              checkDevice(req, res, group2Row);
              group2Row++;
            }
            if (result[0].groupNum == 3){
              saveParticipantTimeStemp(group3Row);
              checkDevice(req, res, group3Row);
              group3Row++;
            }
            if (result[0].groupNum == 4){
              saveParticipantTimeStemp(group4Row);
              checkDevice(req, res, group4Row);
              group4Row++;
            }

            
            //res.render("Explanations" , {signInEmail: req.query.email});
            return;
        }
        res.render('form', {ParticipantNotExist: "The code is not valid"}); //if the participant is not on the system
        return;
    });
});

function userDetails(req,res) {
  if (!req.body) {
      res.status(400).send({message: "Content can not be empty!"})
      return;
  }
  const user = {
      "prolificID": req.body.prolificID,
  };
  res.cookie('ProlificID', req.body.ProlificID);
}

function saveParticipantTimeStemp(groupNum){
  const timestamp = new Date().toLocaleString();            
  sql.query('UPDATE Participants set timeStamp = ? WHERE id = ?', [timestamp, groupNum], (err, fields) => {
      if (err) {
          console.log("error is: " + err);
          res.status(400).send({message: "error in updating Clicks " + err});
          return;
      }
      return;
  });
}


app.get('/Detalis' , (req, res)=>{
  res.render('Detalis');
});

app.get('/Risk2' , (req, res)=>{
  res.render('Risk2');
});

app.get('/Risk3' , (req, res)=>{
  res.render('Risk3');
});

app.get('/Risk4' , (req, res)=>{
  res.render('Risk4');
});

app.get('/Risk5' , (req, res)=>{
  res.render('Risk5');
});

app.get('/Risk6' , (req, res)=>{
  res.render('Risk6');
});

app.get('/Risk7' , (req, res)=>{
  res.render('Risk7');
});

app.get('/Risk8' , (req, res)=>{
  res.render('Risk8');
});

app.get('/Risk9' , (req, res)=>{
  res.render('Risk9');
});

app.get('/Risk10' , (req, res)=>{
  res.render('Risk10');
});

app.get('/Risk1-Group2' , (req, res)=>{
  res.render('Risk1-Group2');
});

app.get('/Risk2-2' , (req, res)=>{
  res.render('Risk2-Group2');
});


app.get('/Risk3-2' , (req, res)=>{
  res.render('Risk3-Group2');
});


app.get('/Risk4-2' , (req, res)=>{
  res.render('Risk4-Group2');
});


app.get('/Risk5-Group2' , (req, res)=>{
  res.render('Risk5-Group2');
});


app.get('/Risk6-2' , (req, res)=>{
  res.render('Risk6-Group2');
});


app.get('/Risk7-2' , (req, res)=>{
  res.render('Risk7-Group2');
});


app.get('/Risk8-2' , (req, res)=>{
  res.render('Risk8-Group2');
});

app.get('/Risk9-Group2' , (req, res)=>{
  res.render('Risk9-Group2');
});


app.get('/Risk10-2' , (req, res)=>{
  res.render('Risk10-Group2');
});



app.get('/wrongDevice' , (req, res)=>{
  res.render('wrongDevice');
});

app.get('/C1' , (req, res)=>{
  res.render('Check1');
});

app.get('/C2' , (req, res)=>{
  res.render('Check2');
});

app.post("/Risk5", CRUD_functions.UpdateCheck1);
app.post("/Risk9", CRUD_functions.UpdateCheck2);