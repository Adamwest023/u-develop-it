//imports mysql2
const mysql = require('mysql2');

//will connext application to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username,
        user: 'root',
        //your MySQL password
        password: '',
        database: 'election'
    });

module.exports = db;