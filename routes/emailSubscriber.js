const express = require('express');
const router = express.Router();
const {getSubscriberByID, createSubscriber, deleteSubscriber, updateSubscriber} = require('../controllers/emailSubscriberController');
const { authenticateJWT } = require('../authentication/authentication');

// To access any route use /subscriber before any these routes.

// Get subscriber with specified patientID
router.get('/', authenticateJWT, getSubscriberByID);

// Create  a new subscriber
router.post('/', authenticateJWT, createSubscriber);

// update  a new subscriber
router.patch('/', authenticateJWT, updateSubscriber);

// Delete subscriber with specified patientID
router.delete('/', authenticateJWT, deleteSubscriber);

module.exports = router;
