const express = require('express');
const router = express.Router();
const { getClinics } = require('../controllers/clinics.js');

router.get('/clinic/:coordinates', getClinics);