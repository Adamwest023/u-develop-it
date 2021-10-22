//imports express into the file
const exp = require('constants');
const express = require('express');

//connects to routes in our apiRoutes folder 
//node.js will automatically look for index.js
const apiRoutes = require('./routes/apiRoutes');



//adds a port designation
const PORT = process.env.PORT || 3001;
//adds the app expression
const app = express();


//adds the Express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//creates a route to the apiRoutes
app.use('./api',apiRoutes);

// route test (don't delete for example purpose)
// app.get('/', (req,res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

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

