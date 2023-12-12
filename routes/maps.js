const express = require('express');
const router = express.Router();
const { getNearbyRadiusClinics, getNearbyNumberClinics } = require('../controllers/mapController');

router.get('/radius/:radius/positions/:coordinates', getNearbyRadiusClinics);
router.get('/number/:nearby_clinics_number/positions/:coordinates', getNearbyNumberClinics);

module.exports = router