const express = require('express');
const router = express.Router();
const { getDentistTimeslots } = require('../controllers/timeslotController.js');

/* GET timeslots with matching dentist ID.*/
router.get('/dentists/:dentistID', getDentistTimeslots);

module.exports = router;
