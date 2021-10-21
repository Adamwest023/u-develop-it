//imports express into the file
const exp = require('constants');
const express = require('express');

//imports mysql2
const mysql = require('mysql2');

//adds a port designation
const PORT = process.env.PORT || 3001;
//adds the app expression
const app = express();


//adds the Express.js middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//will connext application to the MySQL database
const db = mysql.createConnection(
    {
        host:'localhost',
        //Your MySQL username,
        user:'root',
        //your MySQL password
        password:'Adam1404',
        database: 'election'
    },
    console.log('Connected to the elecction database.')
);


// route test (don't delete for example purpose)
// app.get('/', (req,res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });


//route that test our database connection
db.query(`SELECT * FROM candidates`, (err,rows) => {
    console.log(rows);
});

//route that handles request that arn't supported bt the app
//needs to be below all other routes 
app.use((req,res) => {
    res.status(404).end();
});





//starts the express.js on port 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});