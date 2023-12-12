const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

//Get a subscriber
async function getNearbyRadiusClinics(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const radius = req.params.radius
        const reference_position = req.params.coordinates

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
        await mqttTimeout(uuid, 1000000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

//Create a subscriber
async function getNearbyNumberClinics(req, res, next) {

    if (!client.connected){
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();

    try {
        const nearby_clinics_number = req.params.nearby_clinics_number
        const reference_position = req.params.coordinates
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
        await mqttTimeout(uuid, 1000000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getNearbyRadiusClinics, getNearbyNumberClinics
}
