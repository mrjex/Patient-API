const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

//This controller will handle all interactions pertaining to fetching clinics

//Get a subscriber
async function getSubscriberByID(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const patient_ID = req.patient.patient_id
        const publishTopic = "grp20/req/subscriber/get";
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            requestID: uuid,
            patient_ID: patient_ID
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 1000000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

//Create a subscriber
async function createSubscriber(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const patient_ID = req.patient.patient_id;
        const email = req.body.email;
        const clinic = req.body.clinic;
        const publishTopic = "grp20/req/notification/sub"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            requestID: uuid,
            patient_ID: patient_ID,
            email: email,
            clinic: clinic
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 1000000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

//Delete a subscriber
async function deleteSubscriber(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const patient_ID = req.patient.patient_id
        const publishTopic = "grp20/req/notification/unsub";
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            requestID: uuid,
            patient_ID: patient_ID
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 1000000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getSubscriberByID, createSubscriber, deleteSubscriber
}