//imports express into the file
const exp = require('constants');
const express = require('express');

//imports mysql2
const mysql = require('mysql2');

//adds a port designation
const PORT = process.env.PORT || 3001;
//adds the app expression
const app = express();

//add a module we will use in posting new candidates
const inputCheck = require('./utils/inputCheck');


//adds the Express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//will connext application to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username,
        user: 'root',
        //your MySQL password
        password: 'Adam1404',
        database: 'election'
    },
    console.log('Connected to the election database.')
);


// route test (don't delete for example purpose)
// app.get('/', (req,res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });


//route that test our database connection
//Get all candidates
app.get('/api/candidates', (req, res) => {
    //set our command in a variable
    //uses JOIN to add a row from a different table
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            //instead of loging an error we send a status code and place the error message in the json obj
            res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });

    });
});

//create a query that gets a candidate based on id for single candidate
//(the route end point, paramaters, create function)
app.get('/api/candidate/:id', (req, res) => {
    //set command in a variable for the query
    //use JOIN to add information from another table and where it will be placed with LEFT JOIN
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id 
                 WHERE candidates.id = ?`;
    const params = [req.params.id];

    //(command,arguments, create function)
    db.query(sql, params, (err, row) => {
        if (err) {
            //return error message into the json object
            res.status(400).json({ error: err.message });
            return;
        }
        //return result in the json obj
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Delete a candidate based on id using the delete() method 
// (endpoint with id, paramaters, create function)
app.delete('api/candidate/:id', (req,res) =>{
    // command created as a variable
    const sql = `DELETE FROM candidates WHERE id = ?`;
    // set parameters as a variable 
    const params = [req.params.id];
    //run the query with the variables 
    db.query(sql, params, (err,result) => {
        if (err) {
            //place error message in the json object 
            res.statusMessage(400).json({ error: res.message});
        // conditional if user tries to delete a row that isn't there 
        } else if (!result.affectedRows){
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json ({
                message: ' deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//Create a candidate based on id using the post() method
//(endpoint, parameters using using the req.body for the data using object deconstruction, new function)
app.post('/api/candidate',({body},res) => {
    //used a module called inputCheck to validate user info
    const errors = inputCheck(body, 'first_name','last_name','industry_connected');
    if (errors) {
        res.status(400).json({error:errors});
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    
    db.query( sql,params,(err,result) =>{
        if (err){
            res.status(400).json({error:err.message});
            return;

        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//assign the command to a variable
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
//assign the paramaters to a variable
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });


//route that handles request that arn't supported bt the app
//needs to be below all other routes 
app.use((req, res) => {
    res.status(404).end();
});





//starts the express.js on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});