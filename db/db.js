const mysql = require("mysql2");
//var connection =mysql.createConnection("mysql://b8d5b31af359da:d0dbfb07@us-cdbr-east-06.cleardb.net/heroku_33ce5531588afeb?reconnect=true");
const dbConfig = require("./db.config.js");
// Create a connection to the database

const connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
}); 
// open the MySQL connection
// connection.connect(error => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
// });
module.exports = connection;