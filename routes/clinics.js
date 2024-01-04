const express = require('express');
const router = express.Router();
const { getClinics, getClinicById, getNearbyRadiusClinics, getNearbyNumberClinics } = require('../controllers/clinicController');

router.get('/', getClinics);

router.get('/:clinic_id', getClinicById);

router.get('/radius/positions', getNearbyRadiusClinics);

router.get('/number/positions', getNearbyNumberClinics);

module.exports = router