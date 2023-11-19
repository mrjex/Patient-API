const express = require('express');
const router = express.Router();

/* GET appointments with matching userID. */
router.get('/users/:userID', function(req, res, next) {
  res.json({appointments: "response" });
});

/* GET appointments with matching dentist ID. If booked = false only open appointments are returned*/
router.get('/dentists/:dentistID', function(req, res, next) {
  const bookingStatus = req.query.booked;

  res.json({appointments: "response" });
});


/* Patch a UserID into a booking, thereby 'booking' the appointment 
If userID is empty string patch appointments userID field to empty string,
thereby cancelling appointment*/
router.patch('/:appointmentID', function(req, res, next) {
  res.json({appointment: "response" });
});

module.exports = router;
