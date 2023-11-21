const express = require('express');
const router = express.Router();
const { getUsersAppointments, createAppointment, cancelAppointment } = require('../controllers/appointmentController');

/* GET appointments with matching patientID. */
router.get('/users/:patientID', getUsersAppointments);

/* POST appointment using a patientID and appointmentID*/
router.post('/', createAppointment);

/* DELETE appointment using a appointmentID*/
router.post('/:appointmentID', cancelAppointment);

module.exports = router;
