const express = require('express');
const router = express.Router();
const {getPatient, getPatientEmail, createPatient, loginPatient, updatePatient, deletePatient} = require('../controllers/patientsController.js');
const { authenticateJWT } = require('../authentication/authentication');


// To access any route use /patient before any these routes. Example: localhost3000/patient/login

// Get patient with specified patientID
router.get('/', authenticateJWT, getPatient);

// Get patient email with specified patientID
router.get('/:patient_id', getPatientEmail);

// Create  a new patient/user
router.post('/', createPatient);

// Login user
router.post('/login', loginPatient);

// Update patient information with specified patientID
router.patch('/', authenticateJWT, updatePatient);

// Delete patient with specified patientID
router.delete('/', authenticateJWT, deletePatient);

module.exports = router;
