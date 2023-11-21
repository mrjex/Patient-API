const express = require('express');
const router = express.Router();
const { getUsersAppointments, createAppointment } = require('../controllers/appointmentController');

/* GET appointments with matching patientID. */
router.get('/users/:patientID', getUsersAppointments);

/* POST appointment using a patientID and appointmentID*/
router.post('/', createAppointment);

module.exports = router;
