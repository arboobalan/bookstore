const mysql = require('mysql');
const dotenv  = require('dotenv');
dotenv.config();

var conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.MYSQLPORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

conn.connect(function (err) {
    if (err) throw err;
    console.log('Database Connected Sucessfully');
});

module.exports = conn;