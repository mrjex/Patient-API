const express = require('express');
const router = express.Router();
const { getDentistAvailableTimes } = require('../controllers/timeslotController.js');

/* GET timeslots with matching dentist ID.*/
router.get('/dentists/:dentistID', getDentistAvailableTimes);

module.exports = router;
