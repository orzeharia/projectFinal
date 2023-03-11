//import
const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const sql = require('./db/db');
const CRUD_functions = require("./db/CRUD_functions"); 
const fs = require('fs');
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');
const CreateDB = require('./db/createBD');
var device = require('express-device');
var cookieParser = require('cookie-parser')


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
  res.redirect('form');
});

app.get('/HomePage' , (req, res)=>{
  res.render('HomePage');
});

app.get('/form' , (req, res)=>{
  res.render('form');
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
app.post("/ValidParticipant", CRUD_functions.ValidParticipant);

//UpdateDetailes
app.post("/UpdateParticipant", CRUD_functions.UpdateParticipant);


app.get('/hello',function(req,res) {
  res.send("Hi to "+req.device.type.toUpperCase()+" User");
});
app.post("/insertClick", CRUD_functions.insertClick);


//save real user device in the participants table
/////שומר את המכשיר ומבצע בדיקה האם המכשיר הוא המכשיר המיועד + מסווג לפי קבוצת ניסוי. צריך להעביר את כל זה לתוך הפונקציה של הפורם
app.use(device.capture());
app.post('/Savedevice', (req, res) => {
  console.log("bbbbb");
  const Usercode = req.cookies.code;
  console.log("AAAAAAA");
  const device = req.device.type.toUpperCase();
  console.log("BBBBB");
  const s = 'UPDATE Participants set realDevice =? WHERE code = ?'; 
  console.log("ccccccc");
  sql.query(s, [device,Usercode], (err, result) => {
      if (err) {
          console.log("ddddddd");
          console.error('Error inserting data: ' + err.message);
          return res.status(500).json({ error: 'Error inserting data' });
      }
      console.log("eeeeeee");
      const q = `SELECT * FROM Participants WHERE code = ?`;
      sql.query(q, [Usercode], (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
              const user = results[0];
              if(user.device == device) { //check if the user use the device that he need
                  if (user.groupNum == 1) { //group 1 - send to little infirmation risks
                      res.render("Risk1");
                  } 
                  else { // group 2 - send to infirmation load risks
                      res.render("Risk1-Group2"); 
                  }
              } 
              else {
                  res.render("wrongDevice");
              }
          }
      });
  });
});


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

app.get('/Risk2-Group2' , (req, res)=>{
  res.render('Risk2-Group2');
});


app.get('/Risk3-Group2' , (req, res)=>{
  res.render('Risk3-Group2');
});


app.get('/Risk4-Group2' , (req, res)=>{
  res.render('Risk4-Group2');
});


app.get('/Risk5-Group2' , (req, res)=>{
  res.render('Risk5-Group2');
});


app.get('/Risk6-Group2' , (req, res)=>{
  res.render('Risk6-Group2');
});


app.get('/Risk7-Group2' , (req, res)=>{
  res.render('Risk7-Group2');
});

app.get('/Risk7-Group2' , (req, res)=>{
  res.render('Risk7-Group2');
});

app.get('/Risk8-Group2' , (req, res)=>{
  res.render('Risk8-Group2');
});

app.get('/Risk9-Group2' , (req, res)=>{
  res.render('Risk9-Group2');
});


app.get('/Risk10-Group2' , (req, res)=>{
  res.render('Risk10-Group2');
});



app.get('/wrongDevice' , (req, res)=>{
  res.render('wrongDevice');
});

