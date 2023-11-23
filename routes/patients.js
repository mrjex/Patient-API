const express = require('express');
const router = express.Router();
const {getPatient, createPatient, updatePatient, deletePatient} = require('../controllers/patientsController.js');

// To access any route use /patient before any these routes. Example: localhost3000/patient/create

// Get patient with specified patientID
router.get('/:patientID', getPatient);

// Create  a new patient/user
router.post('/create', createPatient);

// Update patient information with specified patientID
router.patch('/update/:patientID', updatePatient);

// Delete patient with specified patientID
router.delete('/delete/:patientID', deletePatient);

module.exports = router;
