const sql = require("./db.js");
var path = require("path");
const e = require("express");
var url = require('url');
const userAgent = require('user-agent');
var SQL = require('./db');
var Promise = require('promise');

//valid participant
const ValidParticipant = (req,res) =>{
    var code = req.body.code;
    sql.query(`SELECT * FROM Participants WHERE code = '${code}' ` , (err, result) => {
        console.log("results", result);
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting participant by name: " + err});
            return;
        }
        if (result.length != 0){// found the participant
            /////////להוסיף כאן קריאה לעוד פונקציה שבודקת האם המשתמש התחבר מהמכשיר הנכון- saveDevice
            userDetails(req,res);
            //checkDevice.checkDevice(req);
            saveParticipantTimeStemp(code);
            res.render("Explanations" , {signInEmail: req.query.email});
            return;
        }
        res.render('form', {ParticipantNotExist: "The code is not valid"}); //if the participant is not on the system
        return;
    });
}


function saveParticipantTimeStemp(code){
    const timestamp = new Date().toLocaleString();            
    sql.query('UPDATE Participants set timeStamp = ? WHERE code = ?', [timestamp, code], (err, fields) => {
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in updating Clicks " + err});
            return;
        }
        return;
    });
}

function userDetails(req,res) {
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"})
        return;
    }
    const user = {
        "code": req.body.code,
    };
    res.cookie('code', req.body.code);


    /*
    getGroupNum(user.code).then((groupNum) => {
        console.log("xxxxxxxx");
        console.log(groupNum);
        res.cookie('groupNum', groupNum);///////////////זה נופל פה!!!!!!
        //console.log(groupNum);
    })
    .catch((err) => {
        console.log("error: " , err);
        res.status(400).send({message: "error in code: " + err});
    });
    */
}

function getGroupNum(code){
    return new Promise ((resolve, reject) => {
        var Q1 = "SELECT groupNum FROM Participants WHERE code like ?";
        SQL.query(Q1, code, (err, mySQLres)=>{
            if (err) {
                console.log("error: ", err);
                reject(err);
                return ;
            }
            let groupNum = mySQLres[0].groupNum;
            console.log(groupNum);
            resolve(groupNum);
        }); 
    });

}


const UpdateParticipant = (req,res) =>{
    const Usercode = req.cookies.code;
    // check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
    var UpdateParticipant = {
        "Age": req.body.Age,
        "Gender": req.body.Gender,
    };
    let query = "UPDATE Participants set Age = ? , Gender = ?  WHERE code = ? ";
    let data = [UpdateParticipant.Age, UpdateParticipant.Gender, Usercode];
    
    sql.query(query, data, (err, results, fields)=>{
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in updating Participant " + err});
            return;
        }
        res.render("FinalPage");
    });
};

//insert new record to click table
const insertClick = (req,res) =>{
    const code = req.cookies.code;
    const RiskID = req.body.RiskID;
    const timestamp = new Date().toLocaleString();
    // check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
    var UpdateRate = {
        "Riskrate": req.body.Riskrate,
    };


    const query = 'INSERT INTO Clicks (Riskrate,code, RiskID, timeStamp ) VALUES (?,?,?,?)';
    const data = [UpdateRate.Riskrate, code, RiskID, timestamp];

    sql.query(query, data, (err, results, fields)=>{
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in updating Clicks " + err});
            return;
        }
        const redirectUrl = req.body.redirect_url;
        res.redirect(redirectUrl);
    });
};



module.exports = {ValidParticipant, UpdateParticipant, insertClick};
