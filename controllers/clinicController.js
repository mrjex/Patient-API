const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

//This controller will handle all interactions pertaining to fetching clinics

//Get all clinics (should this be based on coordinates?)
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
//Get specific clinic (should this be based on coordinates?)
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
module.exports = {
    getClinics,
    getClinicById
}