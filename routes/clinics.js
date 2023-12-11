const express = require('express');
const router = express.Router();
const { getClinics, getClinicById } = require('../controllers/clinicController');

router.get('/', getClinics);

router.get('/:clinic_id', getClinicById);

module.exports = router