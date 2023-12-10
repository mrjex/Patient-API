const express = require('express');
const router = express.Router();
const { getUsersAppointments, createAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { authenticateJWT } = require('../authentication/authentication');


/* GET appointments with matching patientID. */
router.get('/users/:patientID', authenticateJWT, getUsersAppointments);

/* POST appointment using a patientID and appointmentID*/
router.post('/', authenticateJWT, createAppointment);

/* DELETE appointment using a appointmentID*/
router.delete('/:appointmentID', authenticateJWT, cancelAppointment);

module.exports = router;
