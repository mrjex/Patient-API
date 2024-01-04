const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

//This controller will handle all interactions pertaining to fetching clinics

//Get all clinics
async function getClinics(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const publishTopic = "grp20/req/clinics/get";
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

//Get specific clinic
async function getClinicById(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }
    const clinic_id = req.params.clinic_id;
    const uuid = uuidv4();

    try {
        const publishTopic = "grp20/req/clinics/get";
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            requestID: uuid,
            clinic_id: clinic_id
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}


// Get all clinics that are within the range of the radius from the reference position
async function getNearbyRadiusClinics(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const radius = req.query.radius
        const reference_position = req.query.coordinates

        const publishTopic = "grp20/req/map/query/nearby/radius/get";
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            radius: radius,
            reference_position: reference_position,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

// Get the N closest clinics in relative to the reference position
async function getNearbyNumberClinics(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const nearby_clinics_number = req.query.number
        const reference_position = req.query.coordinates
        const publishTopic = "grp20/req/map/query/nearby/fixed/get"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            nearby_clinics_number: nearby_clinics_number,
            reference_position: reference_position,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getClinics,
    getClinicById,
    getNearbyRadiusClinics,
    getNearbyNumberClinics
}