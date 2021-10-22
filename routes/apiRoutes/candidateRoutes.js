const express = require('express');
const router = express.Router();

// creates connections with the db and util folder
const db = require('../../db/connection');
//add a module we will use in posting new candidates
const inputCheck = require('../../utils/inputCheck');

//route that test our database connection
//Get all candidates
router.get('/api/candidates', (req, res) => {
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
router.get('/api/candidate/:id', (req, res) => {
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

//Create a candidate based on id using the post() method
//(endpoint, parameters using using the req.body for the data using object deconstruction, new function)
router.post('/api/candidate', ({ body }, res) => {
    //used a module called inputCheck to validate user info
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;

        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//Update a candidate's party using put() method 
router.put('/api/candidate/:id', (req, res) => {
    //this inputCheck forces our user to include a party_id in any PUT request
    const errors = inputCheck(req.body, 'party_id');
    if(errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `UPDATE candidates SET party.id = ?
                 WHERE id = ? `;
    const params = [req.body.party_id, req.params.id];

    db.query(sql,params, (err, result) =>{
        if(err) {
            res.status(400).json({ error: err.message});
            //check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        }else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//Delete a candidate based on id using the delete() method 
// (endpoint with id, paramaters, create function)
router.delete('api/candidate/:id', (req, res) => {
    // command created as a variable
    const sql = `DELETE FROM candidates WHERE id = ?`;
    // set parameters as a variable 
    const params = [req.params.id];
    //run the query with the variables 
    db.query(sql, params, (err, result) => {
        if (err) {
            //place error message in the json object 
            res.statusMessage(400).json({ error: res.message });
            // conditional if user tries to delete a row that isn't there 
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: ' deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;