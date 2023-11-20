const express = require('express');
const router = express.Router();
const { getUsersAppointments, getDentistTimeslots, createAppointment } = require('../controllers/appointmentController');

/* GET timeslots with matching dentist ID.*/
router.get('/dentists/:dentistID', getDentistTimeslots);

module.exports = router;
