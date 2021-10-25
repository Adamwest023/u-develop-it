//acts as our central hub to pull all the files together

const express = require('express');
const router = express.Router();

//these are connections the index.js files to the routes
router.use(require('./candidateRoutes'));
router.use(require('./partyRoutes'));
router.use(require('./voterRoutes'));

module.exports = router;