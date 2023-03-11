var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');

//create Participants table
const CreateParticipantsTable = (req,res)=> {
    var Q0 = `CREATE TABLE IF NOT EXISTS Participants (
        code varchar(255) NOT NULL PRIMARY KEY, 
        device varchar(255) NOT NULL, 
        groupNum int not null,
        Age varchar(255),
        Gender varchar(255),
        realDevice varchar(255),
        timeStamp varchar(255)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q0,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating Participants table"});
            return;
        }
        console.log('created Participants table');
        res.send("Participants table created");
        return;
    })      
}

//insert into Participants table
const InsertDataToParticipants = (req,res)=>{
    var Q14 = "INSERT INTO Participants SET ?";
    const csvFilePath1= path.join(__dirname, "Participants.csv");
    console.log(csvFilePath1);
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        //console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "code": element.code,
                "device": element.device,
                "groupNum": element.groupNum,
            }
            SQL.query(Q14, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting Participants data", err);
                }
                console.log("created row sucssefuly ");
            });
        });
    })
    res.send("Participants Data read");
};


//drop Participants table
const DropTableParticipants = (req, res)=>{
    var Q12 = "DROP TABLE Participants";
    SQL.query(Q12, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping Participants table ", err);
            res.status(400).send({message: "error im dropping Participants table" + err});
            return;
        }
        console.log("Participants table drpped");
        res.send("Participants table drpped");
        return;
    })
}


const ShowTable = (req,res)=>{
    var Q3 = "SELECT * FROM Participants";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};


//create Clicks table
const CreateClicksTable = (req,res)=> {
    var Q0 = `CREATE TABLE IF NOT EXISTS Clicks (
        code varchar(255), 
        timeStamp varchar(255), 
        riskID varchar(255),
        Riskrate int
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q0,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating Clicks table"});
            return;
        }
        console.log('created Clicks table');
        res.send("Clicks table created");
        return;
    })      
}

const ShowClicksTable = (req,res)=>{
    var Q3 = "SELECT * FROM Clicks";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

//drop Clicks table
const DropTableClicks = (req, res)=>{
    var Q12 = "DROP TABLE Clicks";
    SQL.query(Q12, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping Clicks table ", err);
            res.status(400).send({message: "error im dropping Clicks table" + err});
            return;
        }
        console.log("Clicks table drpped");
        res.send("Clicks table drpped");
        return;
    })
}




module.exports = {CreateParticipantsTable, DropTableParticipants, ShowTable, InsertDataToParticipants, CreateClicksTable, ShowClicksTable, DropTableClicks }