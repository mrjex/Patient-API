const express = require('express');
const router = express.Router();
const { getClinics } = require('../controllers/clinicController');

router.get('/clinics', getClinics);

module.exports = router