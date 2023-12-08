const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

//This controller will handle all interactions pertaining to fetching clinics

//Get all clinics (should this be based on coordinates?)
async function getClinics() {

}

async function getSpecificClinic() {

}

async function getDentistFromSpecificClinic() {
    
}