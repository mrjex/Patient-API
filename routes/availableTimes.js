const express = require('express');
const router = express.Router();
const { getDentistAvailableTimes, getClinicAvailableTimesTimeWindow } = require('../controllers/timeslotController.js');

/* GET timeslots with matching dentist ID.*/
router.get('/dentists/:dentist_id', getDentistAvailableTimes);

router.get('/clinics/', getClinicAvailableTimesTimeWindow);

module.exports = router;
