const express = require('express');
const router = express.Router();
const { getDentistAvailableTimes } = require('../controllers/timeslotController.js');

/* GET timeslots with matching dentist ID.*/
router.get('/dentists/:dentist_id', getDentistAvailableTimes);

module.exports = router;
