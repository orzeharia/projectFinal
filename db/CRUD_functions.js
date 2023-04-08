const sql = require("./db.js");
//import { sql } from "../app";
var path = require("path");
const e = require("express");
var url = require('url');
const userAgent = require('user-agent');
// var SQL = require('./db');
var Promise = require('promise');
const { log } = require("console");


const UpdateParticipant = (req,res) =>{
    const ProlificID = req.cookies.ProlificID;
    // check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
    var UpdateParticipant = {
        "Age": req.body.Age,
        "Gender": req.body.Gender,
        "education" :  req.body.Education ,
        "computerHours" : req.body.ComputerHours , 
        "mobileHours" : req.body.MobileHours ,

    };
    let query = "UPDATE Participants set Age = ? , Gender = ? , education = ? , computerHours = ? , mobileHours = ?  WHERE ProlificID = ? ";
    let data = [UpdateParticipant.Age, UpdateParticipant.Gender, UpdateParticipant.education , UpdateParticipant.computerHours, UpdateParticipant.mobileHours, ProlificID];
    
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
    const ProlificID = req.cookies.ProlificID;
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

    const query = 'INSERT INTO Clicks (Riskrate,ProlificID, RiskID, timeStamp ) VALUES (?,?,?,?)';
    const data = [UpdateRate.Riskrate, ProlificID, RiskID, timestamp];

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


const UpdateCheck1 = (req,res) =>{
    const ProlificID = req.cookies.ProlificID;
    // check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
    var UpdateCheck1 = {
        "check1": req.body.check1,

    };
    let query = "UPDATE Participants set check1 = ?  WHERE ProlificID = ? ";
    let data = [UpdateCheck1.check1, ProlificID];
    
    sql.query(query, data, (err, results, fields)=>{
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in updating checks " + err});
            return;
        }
        const a = `SELECT * FROM Participants WHERE ProlificID = ?`;
            sql.query(a, [ProlificID], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                const user = results[0];
                if (user.groupNum == 1 || user.groupNum == 3 ) { //group 1 or 3 - send to little infirmation risks
                    res.render("Risk5");
                } 
                else { // group 2 or 4 - send to infirmation load risks
                    res.render("Risk5-Group2"); 
                }
            }
            });
    });
};

const UpdateCheck2 = (req,res) =>{
    const ProlificID = req.cookies.ProlificID;
    // check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
    var UpdateCheck2 = {
        "check2": req.body.check2,

    };
    let query = "UPDATE Participants set check2 = ?  WHERE ProlificID = ? ";
    let data = [UpdateCheck2.check2, ProlificID];
    
    sql.query(query, data, (err, results, fields)=>{
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in updating checks " + err});
            return;
        }
        const a = `SELECT * FROM Participants WHERE ProlificID = ?`;
            sql.query(a, [ProlificID], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                const user = results[0];
                if (user.groupNum == 1 || user.groupNum == 3) { //group 1 or 3 - send to little infirmation risks
                    res.render("Risk9");
                } 
                else { // group 2 or 4- send to infirmation load risks
                    res.render("Risk9-Group2"); 
                }
            }
            });
    });
};

module.exports = {UpdateParticipant, insertClick, UpdateCheck1, UpdateCheck2};
