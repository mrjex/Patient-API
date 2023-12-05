const express = require('express');
const router = express.Router();
const {getPatient, createPatient, loginPatient, updatePatient, deletePatient} = require('../controllers/patientsController.js');

// To access any route use /patient before any these routes. Example: localhost3000/patient/login

// Get patient with specified patientID
router.get('/:patientID', getPatient);

// Create  a new patient/user
router.post('/', createPatient);

// Login user
router.post('/login', loginPatient);

// Update patient information with specified patientID
router.patch('/:patientID', updatePatient);

// Delete patient with specified patientID
router.delete('/:patientID', deletePatient);

module.exports = router;
